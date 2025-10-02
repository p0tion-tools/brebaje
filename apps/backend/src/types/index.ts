/**
 * Group the details for a VM EC2 instance.
 * @typedef {Object} EC2Instance
 * @property {string} instanceId - the unique identifier of the VM.
 * @property {string} imageId - the unique identifier of the image.
 * @property {string} instanceType - the VM type.
 * @property {string} keyName - the name of the key.
 * @property {string} launchTime - the timestamp of the launch of the VM.
 */
export type EC2Instance = {
  instanceId: string;
  imageId: string;
  instanceType: string;
  keyName: string;
  launchTime: string;
};
