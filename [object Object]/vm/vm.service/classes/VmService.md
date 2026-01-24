[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [vm/vm.service](../README.md) / VmService

# Class: VmService

Defined in: [apps/backend/src/vm/vm.service.ts:32](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L32)

## Constructors

### Constructor

> **new VmService**(): `VmService`

#### Returns

`VmService`

## Methods

### checkIfRunning()

> **checkIfRunning**(`instanceId`): `Promise`\<`boolean`\>

Defined in: [apps/backend/src/vm/vm.service.ts:241](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L241)

Check if the current VM EC2 instance is running by querying the status.

#### Parameters

##### instanceId

`string`

The unique identifier of the EC2 VM instance.

#### Returns

`Promise`\<`boolean`\>

True if the current status of the EC2 VM instance is 'running'; otherwise false.

***

### computeDiskSizeForVM()

> **computeDiskSizeForVM**(`zKeySizeInBytes`, `pot`): `number`

Defined in: [apps/backend/src/vm/vm.service.ts:90](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L90)

Compute the VM disk size.

#### Parameters

##### zKeySizeInBytes

`number`

The size of the zKey in bytes.

##### pot

`number`

The amount of powers needed for the circuit (index of the PPoT file).

#### Returns

`number`

The configuration of the VM disk size in GB.

#### Remarks

The disk size is computed using the zKey size in bytes taking into consideration
the verification task (2 * zKeySize) + ptauSize + OS/VM (~8GB).

***

### createEC2Instance()

> **createEC2Instance**(`commands`, `instanceType`, `volumeSize`, `diskType`): `Promise`\<[`EC2Instance`](../../../types/type-aliases/EC2Instance.md)\>

Defined in: [apps/backend/src/vm/vm.service.ts:147](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L147)

Creates a new EC2 instance

#### Parameters

##### commands

`string`[]

The list of commands to be run on the EC2 instance.

##### instanceType

`string`

The type of the EC2 VM instance.

##### volumeSize

`number`

The size of the disk (volume) of the VM.

##### diskType

`VolumeType`

The type of the disk (volume) of the VM.

#### Returns

`Promise`\<[`EC2Instance`](../../../types/type-aliases/EC2Instance.md)\>

The instance that was created

***

### evaluateVerificationResult()

> **evaluateVerificationResult**(`commandOutput`, `commandStatus`): `number`

Defined in: [apps/backend/src/vm/vm.service.ts:482](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L482)

Evaluate verification command results and return HTTP status code.

#### Parameters

##### commandOutput

`string`

The stdout from the verification command.

##### commandStatus

`string`

The execution status from SSM.

#### Returns

`number`

HTTP status code (200 for success, 400 for verification failure).

#### Remarks

This method interprets SSM command execution results for verification operations.

***

### getEC2Client()

> **getEC2Client**(): `EC2Client`

Defined in: [apps/backend/src/vm/vm.service.ts:115](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L115)

Get the EC2 client to create new AWS instances

#### Returns

`EC2Client`

The instance of the EC2 client.

***

### getSSMClient()

> **getSSMClient**(): `SSMClient`

Defined in: [apps/backend/src/vm/vm.service.ts:129](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L129)

Get the SSM client to interact with AWS Systems Manager (interact with EC2 instances).

#### Returns

`SSMClient`

The instance of the SSM client.

***

### retrieveCommandOutput()

> **retrieveCommandOutput**(`instanceId`, `commandId`): `Promise`\<`string`\>

Defined in: [apps/backend/src/vm/vm.service.ts:375](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L375)

Get the output of an SSM command executed on an EC2 VM instance.

#### Parameters

##### instanceId

`string`

The unique identifier of the EC2 VM instance.

##### commandId

`string`

The unique identifier of the command.

#### Returns

`Promise`\<`string`\>

The command output.

***

### retrieveCommandStatus()

> **retrieveCommandStatus**(`instanceId`, `commandId`): `Promise`\<`string`\>

Defined in: [apps/backend/src/vm/vm.service.ts:403](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L403)

Get the status of an SSM command executed on an EC2 VM instance.

#### Parameters

##### instanceId

`string`

The unique identifier of the EC2 VM instance.

##### commandId

`string`

The unique identifier of the command.

#### Returns

`Promise`\<`string`\>

The command status.

***

### runCommandUsingSSM()

> **runCommandUsingSSM**(`instanceId`, `commands`): `Promise`\<`string`\>

Defined in: [apps/backend/src/vm/vm.service.ts:344](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L344)

Run a command on an EC2 VM instance by using SSM.

#### Parameters

##### instanceId

`string`

The unique identifier of the EC2 VM instance.

##### commands

`string`[]

The list of commands.

#### Returns

`Promise`\<`string`\>

The unique identifier of the command.

#### Remarks

This method returns the command identifier for checking the status and retrieve
the output of the command execution later on.

***

### startEC2Instance()

> **startEC2Instance**(`instanceId`): `Promise`\<`void`\>

Defined in: [apps/backend/src/vm/vm.service.ts:273](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L273)

Start an EC2 VM instance.

#### Parameters

##### instanceId

`string`

The unique identifier of the EC2 VM instance.

#### Returns

`Promise`\<`void`\>

#### Remarks

The instance must have been created previously.

***

### stopEC2Instance()

> **stopEC2Instance**(`instanceId`): `Promise`\<`void`\>

Defined in: [apps/backend/src/vm/vm.service.ts:296](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L296)

Stop an EC2 VM instance.

#### Parameters

##### instanceId

`string`

The unique identifier of the EC2 VM instance.

#### Returns

`Promise`\<`void`\>

#### Remarks

The instance must have been in a running status.

***

### terminateEC2Instance()

> **terminateEC2Instance**(`instanceId`): `Promise`\<`void`\>

Defined in: [apps/backend/src/vm/vm.service.ts:318](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L318)

Terminate an EC2 VM instance.

#### Parameters

##### instanceId

`string`

The unique identifier of the EC2 VM instance.

#### Returns

`Promise`\<`void`\>

***

### vmBootstrapCommands()

> **vmBootstrapCommands**(`bucketName`): `string`[]

Defined in: [apps/backend/src/vm/vm.service.ts:39](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L39)

Return the list of bootstrap commands to be executed.

#### Parameters

##### bucketName

`string`

The name of the AWS S3 bucket.

#### Returns

`string`[]

The list of startup commands to be executed.

#### Remarks

The startup commands must be suitable for a shell script.

***

### vmDependenciesAndCacheArtifactsCommand()

> **vmDependenciesAndCacheArtifactsCommand**(`zKeyPath`, `potPath`): `string`[]

Defined in: [apps/backend/src/vm/vm.service.ts:53](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L53)

Return the list of Node environment (and packages) installation plus artifact caching for contribution verification.

#### Parameters

##### zKeyPath

`string`

The path to zKey artifact inside AWS S3 bucket.

##### potPath

`string`

The path to ptau artifact inside AWS S3 bucket.

#### Returns

`string`[]

The array of commands to be run by the EC2 instance.

***

### vmVerificationPhase1Command()

> **vmVerificationPhase1Command**(`bucketName`, `lastPtauStoragePath`): `string`[]

Defined in: [apps/backend/src/vm/vm.service.ts:430](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L430)

Return the list of commands for verification of a phase 1 contribution (Powers of Tau).

#### Parameters

##### bucketName

`string`

The name of the AWS S3 bucket.

##### lastPtauStoragePath

`string`

The last ptau storage path.

#### Returns

`string`[]

The list of commands for contribution verification.

***

### vmVerificationPhase2Command()

> **vmVerificationPhase2Command**(`bucketName`, `lastZkeyStoragePath`, `verificationTranscriptStoragePathAndFilename`): `string`[]

Defined in: [apps/backend/src/vm/vm.service.ts:460](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.service.ts#L460)

Return the list of commands for verification of a phase 2 contribution.

#### Parameters

##### bucketName

`string`

The name of the AWS S3 bucket.

##### lastZkeyStoragePath

`string`

The last zKey storage path.

##### verificationTranscriptStoragePathAndFilename

`string`

The verification transcript storage path.

#### Returns

`string`[]

The list of commands for contribution verification.

#### Remarks

This method generates the verification transcript as well.
