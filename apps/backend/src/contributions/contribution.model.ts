import { Optional } from 'sequelize';
import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';
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
    primaryKey: true,
    autoIncrement: true,
  })
  declare id?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  circuitId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  participantId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  contributionComputationTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fullContributionTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  verifyContributionTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  zkeyIndex?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  valid?: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  lastUpdated?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  files?: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  verificationSoftware?: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  beacon?: any;

  @BelongsTo(() => Circuit, 'circuitId')
  circuit: Circuit;

  @BelongsTo(() => Participant, 'participantId')
  participant: Participant;
}
