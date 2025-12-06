import { DescribeInstanceStatusCommand, EC2Client } from '@aws-sdk/client-ec2';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from 'src/utils/constants';
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
}
