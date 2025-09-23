import { Optional } from 'sequelize';
import { Column, DataType, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { CircuitTimeoutType } from 'src/types/enums';
import { Ceremony } from 'src/ceremonies/ceremony.model';
import { Contribution } from 'src/contributions/contribution.model';
import { CircuitArtifactsType } from 'src/types/declarations';
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
    allowNull: false,
  })
  declare ceremonyId: number;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.ENUM(...Object.values(CircuitTimeoutType)),
    allowNull: false,
    defaultValue: CircuitTimeoutType.FIXED,
  })
  declare timeoutMechanismType: CircuitTimeoutType;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare dynamicThreshold?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare fixedTimeWindow?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare sequencePosition: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare zKeySizeInBytes?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare constraints?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare pot?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare averageContributionComputationTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare averageFullContributionTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare averageVerifyContributionTime?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare compiler?: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare template?: object;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  declare verification: object;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  declare artifacts: CircuitArtifactsType;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare metadata?: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare files?: object;

  @BelongsTo(() => Ceremony, 'ceremonyId')
  declare ceremony: Ceremony;

  @HasMany(() => Contribution, 'circuitId')
  declare contributions: Contribution[];
}
