import {
  DescribeInstanceStatusCommand,
  EC2Client,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';
import {
  GetCommandInvocationCommand,
  SendCommandCommand,
  SendCommandCommandInput,
  SSMClient,
} from '@aws-sdk/client-ssm';
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_SNS_TOPIC_ARN,
} from 'src/utils/constants';
import { VMManagerService } from 'src/vm/domain/ports/vm-manager.service';

export class AWSEC2VMManagerService implements VMManagerService {
  async getIsRunning(instanceId: string): Promise<boolean> {
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

    return response.InstanceStatuses?.[0]?.InstanceState?.Name === 'running';
  }

  async terminateVm(instanceId: string): Promise<void> {
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

  async stopVm(instanceId: string): Promise<void> {
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

  async startVm(instanceId: string): Promise<void> {
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

  async getCommandStatus(instanceId: string, commandId: string): Promise<string> {
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
    } catch (error: any) {
      throw new Error(
        `Something went wrong when trying to retrieve the command ${commandId} output on the EC2 instance (${instanceId}). More details ${error}`,
      );
    }
  }

  async getCommandOutput(instanceId: string, commandId: string): Promise<string> {
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
    } catch (error: any) {
      throw new Error(
        `Something went wrong when trying to retrieve the command ${commandId} output on the EC2 instance (${instanceId}). More details ${error}`,
      );
    }
  }

  async setupVM(instanceId: string, potPath: string, zKeyPath: string): Promise<string> {
    const commandsToRun = [
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

    const commandId = await this.sendCommandsWithSSM(instanceId, commandsToRun);

    return commandId;
  }

  private async sendCommandsWithSSM(instanceId: string, commands: string[]) {
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
    } catch (error: any) {
      throw new Error(
        `Something went wrong when trying to run a command on the EC2 instance. More details ${error}`,
      );
    }
  }

  /**
   * Get the EC2 client to create new AWS instances
   * @returns <EC2Client> - the instance of the EC2 client.
   */
  private getEC2Client() {
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
   * @returns <SSMClient> - the instance of the SSM client.
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
}
