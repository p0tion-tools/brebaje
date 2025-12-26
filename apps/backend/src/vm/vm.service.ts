import {
  _InstanceType,
  DescribeInstanceStatusCommand,
  EC2Client,
  RunInstancesCommand,
  RunInstancesCommandInput,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
  VolumeType,
} from '@aws-sdk/client-ec2';
import {
  GetCommandInvocationCommand,
  SendCommandCommand,
  SendCommandCommandInput,
  SSMClient,
} from '@aws-sdk/client-ssm';
import { convertBytesOrKbToGb, powersOfTauFiles } from '@brebaje/actions';
import { Injectable } from '@nestjs/common';
import { EC2Instance } from 'src/types';
import {
  AWS_ACCESS_KEY_ID,
  AWS_AMI_ID,
  AWS_INSTANCE_PROFILE_ARN,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_SNS_TOPIC_ARN,
  VM_BOOTSTRAP_SCRIPT_FILENAME,
} from 'src/utils/constants';

@Injectable()
export class VmService {
  /**
   * Return the list of bootstrap commands to be executed.
   * @remarks The startup commands must be suitable for a shell script.
   * @param bucketName - The name of the AWS S3 bucket.
   * @returns The list of startup commands to be executed.
   */
  vmBootstrapCommands(bucketName: string): Array<string> {
    return [
      '#!/bin/bash', // shabang.
      `aws s3 cp s3://${bucketName}/${VM_BOOTSTRAP_SCRIPT_FILENAME} ${VM_BOOTSTRAP_SCRIPT_FILENAME}`, // copy file from S3 bucket to VM.
      `chmod +x ${VM_BOOTSTRAP_SCRIPT_FILENAME} && bash ${VM_BOOTSTRAP_SCRIPT_FILENAME}`, // grant permission and execute.
    ];
  }

  /**
   * Return the list of Node environment (and packages) installation plus artifact caching for contribution verification.
   * @param zKeyPath - The path to zKey artifact inside AWS S3 bucket.
   * @param potPath - The path to ptau artifact inside AWS S3 bucket.
   * @returns The array of commands to be run by the EC2 instance.
   */
  vmDependenciesAndCacheArtifactsCommand(zKeyPath: string, potPath: string): Array<string> {
    return [
      '#!/bin/bash',
      'MARKER_FILE="/var/run/my_script_ran"',

      'if [ -e ${MARKER_FILE} ]; then',
      'exit 0',
      'else',

      'touch ${MARKER_FILE}',
      'sudo yum update -y',
      'curl -O https://nodejs.org/dist/v22.17.1/node-v22.17.1-linux-x64.tar.xz',
      'tar -xf node-v22.17.1-linux-x64.tar.xz',
      'mv node-v22.17.1-linux-x64 nodejs',
      'sudo mv nodejs /opt/',
      "echo 'export NODEJS_HOME=/opt/nodejs' >> /etc/profile",
      "echo 'export PATH=$NODEJS_HOME/bin:$PATH' >> /etc/profile",
      'source /etc/profile',
      'npm install -g snarkjs',
      `aws s3 cp s3://${zKeyPath} /var/tmp/genesisZkey.zkey`,
      `aws s3 cp s3://${potPath} /var/tmp/pot.ptau`,
      'wget https://github.com/BLAKE3-team/BLAKE3/releases/download/1.4.0/b3sum_linux_x64_bin -O /var/tmp/blake3.bin',
      'chmod +x /var/tmp/blake3.bin',
      "INSTANCE_ID=$(ec2-metadata -i | awk '{print $2}')",
      `aws sns publish --topic-arn ${AWS_SNS_TOPIC_ARN} --message "$INSTANCE_ID" --region ${AWS_REGION}`,
      'fi',
    ];
  }

  /**
   * Compute the VM disk size.
   * @remarks The disk size is computed using the zKey size in bytes taking into consideration
   * the verification task (2 * zKeySize) + ptauSize + OS/VM (~8GB).
   * @param zKeySizeInBytes - The size of the zKey in bytes.
   * @param pot - The amount of powers needed for the circuit (index of the PPoT file).
   * @returns The configuration of the VM disk size in GB.
   */
  computeDiskSizeForVM(zKeySizeInBytes: number, pot: number): number {
    const index = pot - 1;
    let potSize = 144;

    const selectedFile = powersOfTauFiles[index];
    if (selectedFile) {
      potSize = selectedFile.size;
    } else {
      // fallback to the biggest ptau file.

      const lastIndex = powersOfTauFiles.length - 1;

      const lastFile = powersOfTauFiles[lastIndex];
      if (lastFile) {
        potSize = lastFile.size;
      }
    }

    return Math.ceil(2 * convertBytesOrKbToGb(zKeySizeInBytes, true) + potSize) + 8;
  }

  /**
   * Get the EC2 client to create new AWS instances
   * @returns The instance of the EC2 client.
   */
  getEC2Client() {
    return new EC2Client({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });
  }

  /**
   * Get the SSM client to interact with AWS Systems Manager (interact with EC2 instances).
   * @returns The instance of the SSM client.
   */
  getSSMClient() {
    return new SSMClient({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });
  }

  /**
   * Creates a new EC2 instance
   * @param commands - The list of commands to be run on the EC2 instance.
   * @param instanceType - The type of the EC2 VM instance.
   * @param volumeSize - The size of the disk (volume) of the VM.
   * @param diskType - The type of the disk (volume) of the VM.
   * @returns The instance that was created
   */
  async createEC2Instance(
    commands: string[],
    instanceType: string,
    volumeSize: number,
    diskType: VolumeType,
  ): Promise<EC2Instance> {
    const ec2Client = this.getEC2Client();

    // Parametrize the VM EC2 instance.
    const params: RunInstancesCommandInput = {
      ImageId: AWS_AMI_ID,
      InstanceType: instanceType as _InstanceType,
      MaxCount: 1,
      MinCount: 1,
      // nb. to find this: iam -> roles -> role_name.
      IamInstanceProfile: {
        Arn: AWS_INSTANCE_PROFILE_ARN,
      },
      // nb. for running commands at the startup.
      UserData: Buffer.from(commands.join('\n')).toString('base64'),
      BlockDeviceMappings: [
        {
          DeviceName: '/dev/xvda',
          Ebs: {
            DeleteOnTermination: true,
            VolumeSize: volumeSize, // disk size in GB.
            VolumeType: diskType,
          },
        },
      ],
      // tag the resource
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {
              Key: 'ProjectName',
              Value: 'brebaje',
            },
            {
              Key: 'Initialized',
              Value: 'false',
            },
          ],
        },
      ],
    };

    try {
      // Create a new command instance.
      const command = new RunInstancesCommand(params);
      // Send the command for execution.
      const response = await ec2Client.send(command);

      if (response.$metadata.httpStatusCode !== 200)
        throw new Error(
          `Something went wrong when creating the EC2 instance. More details: ${JSON.stringify(response)}`,
        );

      const instance = response.Instances && response.Instances[0];
      if (
        !instance ||
        !instance.InstanceId ||
        !instance.ImageId ||
        !instance.InstanceType ||
        !instance.KeyName ||
        !instance.LaunchTime
      ) {
        throw new Error(
          `EC2 RunInstances response is missing required instance fields: ${JSON.stringify(response)}`,
        );
      }

      // Create a new EC2 VM instance.
      return {
        instanceId: instance.InstanceId,
        imageId: instance.ImageId,
        instanceType: instance.InstanceType,
        keyName: instance.KeyName,
        launchTime: instance.LaunchTime.toISOString(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Something went wrong when creating the EC2 instance. More details ${errorMessage}`,
      );
    }
  }

  /**
   * Check if the current VM EC2 instance is running by querying the status.
   * @param instanceId - The unique identifier of the EC2 VM instance.
   * @returns True if the current status of the EC2 VM instance is 'running'; otherwise false.
   */
  async checkIfRunning(instanceId: string): Promise<boolean> {
    const ec2Client = this.getEC2Client();

    // Generate a new describe status command.
    const command = new DescribeInstanceStatusCommand({
      InstanceIds: [instanceId],
    });

    // Run the command.
    const response = await ec2Client.send(command);

    if (response.$metadata.httpStatusCode !== 200)
      throw new Error(
        `Something went wrong when retrieving the EC2 instance (${instanceId}) status. More details ${JSON.stringify(response)}`,
      );

    if (
      !response.InstanceStatuses ||
      response.InstanceStatuses.length === 0 ||
      !response.InstanceStatuses[0].InstanceState ||
      !response.InstanceStatuses[0].InstanceState.Name
    ) {
      return false;
    }
    return response.InstanceStatuses[0].InstanceState.Name === 'running';
  }

  /**
   * Start an EC2 VM instance.
   * @remarks The instance must have been created previously.
   * @param instanceId - The unique identifier of the EC2 VM instance.
   */
  async startEC2Instance(instanceId: string) {
    const ec2Client = this.getEC2Client();

    // Generate a new start instance command.
    const command = new StartInstancesCommand({
      InstanceIds: [instanceId],
      DryRun: false,
    });

    // Run the command.
    const response = await ec2Client.send(command);

    if (response.$metadata.httpStatusCode !== 200)
      throw new Error(
        `Something went wrong when starting the EC2 instance (${instanceId}). More details ${JSON.stringify(response)}`,
      );
  }

  /**
   * Stop an EC2 VM instance.
   * @remarks The instance must have been in a running status.
   * @param instanceId - The unique identifier of the EC2 VM instance.
   */
  async stopEC2Instance(instanceId: string) {
    const ec2Client = this.getEC2Client();

    // Generate a new stop instance command.
    const command = new StopInstancesCommand({
      InstanceIds: [instanceId],
      DryRun: false,
    });

    // Run the command.
    const response = await ec2Client.send(command);

    if (response.$metadata.httpStatusCode !== 200)
      throw new Error(
        `Something went wrong when stopping the EC2 instance (${instanceId}). More details ${JSON.stringify(response)}`,
      );
  }

  /**
   * Terminate an EC2 VM instance.
   * @param instanceId - The unique identifier of the EC2 VM instance.
   */
  async terminateEC2Instance(instanceId: string) {
    const ec2Client = this.getEC2Client();

    // Generate a new terminate instance command.
    const command = new TerminateInstancesCommand({
      InstanceIds: [instanceId],
      DryRun: false,
    });

    // Run the command.
    const response = await ec2Client.send(command);

    if (response.$metadata.httpStatusCode !== 200)
      throw new Error(
        `Something went wrong when terminating the EC2 instance (${instanceId}). More details ${JSON.stringify(response)}`,
      );
  }

  /**
   * Run a command on an EC2 VM instance by using SSM.
   * @remarks This method returns the command identifier for checking the status and retrieve
   * the output of the command execution later on.
   * @param instanceId - The unique identifier of the EC2 VM instance.
   * @param commands - The list of commands.
   * @returns The unique identifier of the command.
   */
  async runCommandUsingSSM(instanceId: string, commands: Array<string>): Promise<string> {
    const ssmClient = this.getSSMClient();

    // Generate a new send command input command.
    const params: SendCommandCommandInput = {
      DocumentName: 'AWS-RunShellScript',
      InstanceIds: [instanceId],
      Parameters: {
        commands,
      },
      TimeoutSeconds: 1200,
    };

    try {
      // Run the command.
      const response = await ssmClient.send(new SendCommandCommand(params));
      return response.Command!.CommandId!;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Something went wrong when trying to run a command on the EC2 instance. More details ${errorMessage}`,
      );
    }
  }

  /**
   * Get the output of an SSM command executed on an EC2 VM instance.
   * @param instanceId - The unique identifier of the EC2 VM instance.
   * @param commandId - The unique identifier of the command.
   * @returns The command output.
   */
  async retrieveCommandOutput(instanceId: string, commandId: string): Promise<string> {
    const ssmClient = this.getSSMClient();

    // Generate a new get command invocation command.
    const command = new GetCommandInvocationCommand({
      CommandId: commandId,
      InstanceId: instanceId,
    });

    try {
      // Run the command.
      const response = await ssmClient.send(command);

      return response.StandardOutputContent!;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Something went wrong when trying to retrieve the command ${commandId} output on the EC2 instance (${instanceId}). More details ${errorMessage}`,
      );
    }
  }

  /**
   * Get the status of an SSM command executed on an EC2 VM instance.
   * @param instanceId - The unique identifier of the EC2 VM instance.
   * @param commandId - The unique identifier of the command.
   * @returns The command status.
   */
  async retrieveCommandStatus(instanceId: string, commandId: string): Promise<string> {
    const ssmClient = this.getSSMClient();

    // Generate a new get command invocation command.
    const command = new GetCommandInvocationCommand({
      CommandId: commandId,
      InstanceId: instanceId,
    });

    try {
      // Run the command.
      const response = await ssmClient.send(command);
      return response.Status!;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Something went wrong when trying to retrieve the command ${commandId} status on the EC2 instance (${instanceId}). More details ${errorMessage}`,
      );
    }
  }

  /**
   * Return the list of commands for verification of a phase 1 contribution (Powers of Tau).
   * @param bucketName - The name of the AWS S3 bucket.
   * @param lastPtauStoragePath - The last ptau storage path.
   * @returns The list of commands for contribution verification.
   */
  vmVerificationPhase1Command(bucketName: string, lastPtauStoragePath: string): Array<string> {
    // Extract filename from path (e.g., "Cardano-PPOT/pot10_0008.ptau" -> "pot10_0008.ptau")
    const filename = lastPtauStoragePath.split('/').pop() || 'unknown.ptau';

    // Generate verification log filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const verificationLogName = `verification-${filename}-${timestamp}.log`;
    const s3LogPath = `verification-logs/${verificationLogName}`;

    return [
      `source /etc/profile`,
      // Download with original filename
      `aws s3 cp s3://${bucketName}/${lastPtauStoragePath} /var/tmp/${filename} > /var/tmp/download.log`,
      // Run verification and save output to log
      `snarkjs powersoftau verify /var/tmp/${filename} > /var/tmp/${verificationLogName} 2>&1`,
      // Upload verification log to S3
      `aws s3 cp /var/tmp/${verificationLogName} s3://${bucketName}/${s3LogPath}`,
      // Clean up all temporary files
      `rm /var/tmp/${filename} /var/tmp/${verificationLogName} /var/tmp/download.log &>/dev/null`,
    ];
  }

  /**
   * Return the list of commands for verification of a phase 2 contribution.
   * @remarks This method generates the verification transcript as well.
   * @param bucketName - The name of the AWS S3 bucket.
   * @param lastZkeyStoragePath - The last zKey storage path.
   * @param verificationTranscriptStoragePathAndFilename - The verification transcript storage path.
   * @returns The list of commands for contribution verification.
   */
  vmVerificationPhase2Command(
    bucketName: string,
    lastZkeyStoragePath: string,
    verificationTranscriptStoragePathAndFilename: string,
  ): Array<string> {
    return [
      `source /etc/profile`,
      `aws s3 cp s3://${bucketName}/${lastZkeyStoragePath} /var/tmp/lastZKey.zkey > /var/tmp/log.txt`,
      `snarkjs zkvi /var/tmp/genesisZkey.zkey /var/tmp/pot.ptau /var/tmp/lastZKey.zkey > /var/tmp/verification_transcript.log`,
      `aws s3 cp /var/tmp/verification_transcript.log s3://${bucketName}/${verificationTranscriptStoragePathAndFilename} &>/dev/null`,
      `/var/tmp/blake3.bin /var/tmp/verification_transcript.log | awk '{print $1}'`,
      `rm /var/tmp/lastZKey.zkey /var/tmp/verification_transcript.log /var/tmp/log.txt &>/dev/null`,
    ];
  }

  /**
   * Evaluate verification command results and return HTTP status code.
   * @remarks This method interprets SSM command execution results for verification operations.
   * @param commandOutput - The stdout from the verification command.
   * @param commandStatus - The execution status from SSM.
   * @returns HTTP status code (200 for success, 400 for verification failure).
   */
  evaluateVerificationResult(commandOutput: string, commandStatus: string): number {
    // Check if SSM command executed successfully
    if (commandStatus !== 'Success') {
      return 400; // Bad Request - command execution failed
    }

    // Check for snarkjs error patterns in output
    if (commandOutput.includes('[ERROR]')) {
      return 400; // Bad Request - verification failed
    }

    // If command succeeded and no errors found, verification passed
    return 200; // OK - verification successful
  }
}
