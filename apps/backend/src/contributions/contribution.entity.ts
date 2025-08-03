import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Circuit, CircuitId } from 'src/circuits/circuit.entity';
import type { Participant, ParticipantId } from 'src/participants/participant.entity';

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

export class Contribution
  extends Model<ContributionAttributes, ContributionCreationAttributes>
  implements ContributionAttributes
{
  circuitId!: number;
  participantId!: number;
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

  // Contribution belongsTo Circuit via circuitId
  circuit!: Circuit;
  getCircuit!: Sequelize.BelongsToGetAssociationMixin<Circuit>;
  setCircuit!: Sequelize.BelongsToSetAssociationMixin<Circuit, CircuitId>;
  createCircuit!: Sequelize.BelongsToCreateAssociationMixin<Circuit>;
  // Contribution belongsTo Participant via participantId
  participant!: Participant;
  getParticipant!: Sequelize.BelongsToGetAssociationMixin<Participant>;
  setParticipant!: Sequelize.BelongsToSetAssociationMixin<Participant, ParticipantId>;
  createParticipant!: Sequelize.BelongsToCreateAssociationMixin<Participant>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Contribution {
    return Contribution.init(
      {
        circuitId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'circuits',
            key: 'id',
          },
        },
        participantId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'participants',
            key: 'id',
          },
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true,
        },
        contributionComputationTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        fullContributionTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        verifyContributionTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        zkeyIndex: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        valid: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        lastUpdated: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        files: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        verificationSoftware: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        beacon: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'contributions',
        timestamps: false,
      },
    );
  }
}
