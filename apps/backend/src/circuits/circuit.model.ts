import { Optional } from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Ceremony } from 'src/ceremonies/ceremony.model';
import { Contribution } from 'src/contributions/contribution.model';
import { CircuitArtifactsType } from 'src/types/declarations';
import { CircuitTimeoutType } from 'src/types/enums';
export interface CircuitAttributes {
  ceremonyId: number;
  id?: number;
  name: string;
  timeoutMechanismType: CircuitTimeoutType;
  dynamicThreshold?: number;
  fixedTimeWindow?: number;
  sequencePosition: number;
  zKeySizeInBytes?: number;
  constraints?: number;
  pot?: number;
  averageContributionComputationTime?: number;
  averageFullContributionTime?: number;
  averageVerifyContributionTime?: number;
  compiler?: object;
  template?: object;
  verification: object;
  artifacts: CircuitArtifactsType;
  metadata?: object;
  files?: object;
}

export type CircuitPk = 'id';
export type CircuitId = Circuit[CircuitPk];
export type CircuitOptionalAttributes =
  | 'id'
  | 'timeoutMechanismType'
  | 'dynamicThreshold'
  | 'fixedTimeWindow'
  | 'zKeySizeInBytes'
  | 'constraints'
  | 'pot'
  | 'averageContributionComputationTime'
  | 'averageFullContributionTime'
  | 'averageVerifyContributionTime'
  | 'compiler'
  | 'template'
  | 'metadata'
  | 'files';
export type CircuitCreationAttributes = Optional<CircuitAttributes, CircuitOptionalAttributes>;

@Table({ tableName: 'circuits' })
export class Circuit extends Model implements CircuitAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ceremonyId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(CircuitTimeoutType)),
    allowNull: false,
    defaultValue: CircuitTimeoutType.FIXED,
  })
  timeoutMechanismType: CircuitTimeoutType;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  dynamicThreshold?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fixedTimeWindow?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sequencePosition: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  zKeySizeInBytes?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  constraints?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  pot?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  averageContributionComputationTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  averageFullContributionTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  averageVerifyContributionTime?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  compiler?: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  template?: any;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  verification: any;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  artifacts: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  files?: any;

  @BelongsTo(() => Ceremony, 'ceremonyId')
  ceremony: Ceremony;

  @HasMany(() => Contribution, 'circuitId')
  contributions: Contribution[];
}
