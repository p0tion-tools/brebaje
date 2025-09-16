import { Optional } from 'sequelize';
import { Column, DataType, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Circuit } from 'src/circuits/circuit.model';
import { Participant } from 'src/participants/participant.model';

export interface ContributionAttributes {
  circuitId: number;
  participantId: number;
  id?: number;
  contributionComputationTime?: number;
  fullContributionTime?: number;
  verifyContributionTime?: number;
  zkeyIndex?: number;
  valid?: boolean;
  lastUpdated?: number;
  files?: object;
  verificationSoftware?: object;
  beacon?: object;
}

export type ContributionPk = 'id';
export type ContributionId = Contribution[ContributionPk];
export type ContributionOptionalAttributes =
  | 'id'
  | 'contributionComputationTime'
  | 'fullContributionTime'
  | 'verifyContributionTime'
  | 'zkeyIndex'
  | 'valid'
  | 'lastUpdated'
  | 'files'
  | 'verificationSoftware'
  | 'beacon';
export type ContributionCreationAttributes = Optional<
  ContributionAttributes,
  ContributionOptionalAttributes
>;

@Table({ tableName: 'contributions' })
export class Contribution extends Model implements ContributionAttributes {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare circuitId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare participantId: number;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare contributionComputationTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare fullContributionTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare verifyContributionTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare zkeyIndex?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare valid?: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare lastUpdated?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare files?: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare verificationSoftware?: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare beacon?: object;

  @BelongsTo(() => Circuit, 'circuitId')
  declare circuit: Circuit;

  @BelongsTo(() => Participant, 'participantId')
  declare participant: Participant;
}
