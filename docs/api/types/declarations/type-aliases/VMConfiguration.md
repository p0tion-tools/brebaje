[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [types/declarations](../README.md) / VMConfiguration

# Type Alias: VMConfiguration

> **VMConfiguration** = `object`

Defined in: [apps/backend/src/types/declarations.d.ts:76](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/types/declarations.d.ts#L76)

Group information about the VM configuration for circuit contribution verification.
the coordinator could choose among CF and VM.
the VM configurations could be retrieved at https://aws.amazon.com/ec2/instance-types/.
vmConfigurationType - the VM configuration type.
vmDiskType - the VM volume type (e.g., gp2)
vmDiskSize - the VM disk size in GB.
vmInstanceId - the VM instance identifier (after VM instantiation).

## Properties

### vmConfigurationType

> **vmConfigurationType**: `string`

Defined in: [apps/backend/src/types/declarations.d.ts:77](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/types/declarations.d.ts#L77)

***

### vmDiskSize?

> `optional` **vmDiskSize**: `number`

Defined in: [apps/backend/src/types/declarations.d.ts:79](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/types/declarations.d.ts#L79)

***

### vmDiskType

> **vmDiskType**: `VolumeType`

Defined in: [apps/backend/src/types/declarations.d.ts:78](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/types/declarations.d.ts#L78)

***

### vmInstanceId?

> `optional` **vmInstanceId**: `string`

Defined in: [apps/backend/src/types/declarations.d.ts:80](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/types/declarations.d.ts#L80)
