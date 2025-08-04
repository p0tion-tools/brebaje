import * as Sequelize from 'sequelize';

export enum CIRCUIT_TIMEOUT_TYPE {
  DYNAMIC = 'DYNAMIC',
  FIXED = 'FIXED',
  LOBBY = 'LOBBY',
}
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ceremony, CeremonyId } from 'src/ceremonies/ceremony.model';
import type { Contribution, ContributionId } from 'src/contributions/contribution.model';

export interface CircuitAttributes {
  ceremonyId: number;
  id?: number;
  name: string;
  timeoutMechanismType: CIRCUIT_TIMEOUT_TYPE;
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
  verification?: object;
  artifacts?: object;
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
  | 'verification'
  | 'artifacts'
  | 'metadata'
  | 'files';
export type CircuitCreationAttributes = Optional<CircuitAttributes, CircuitOptionalAttributes>;

export class Circuit
  extends Model<CircuitAttributes, CircuitCreationAttributes>
  implements CircuitAttributes
{
  ceremonyId!: number;
  id?: number;
  name!: string;
  timeoutMechanismType!: CIRCUIT_TIMEOUT_TYPE;
  dynamicThreshold?: number;
  fixedTimeWindow?: number;
  sequencePosition!: number;
  zKeySizeInBytes?: number;
  constraints?: number;
  pot?: number;
  averageContributionComputationTime?: number;
  averageFullContributionTime?: number;
  averageVerifyContributionTime?: number;
  compiler?: object;
  template?: object;
  verification?: object;
  artifacts?: object;
  metadata?: object;
  files?: object;

  // Circuit belongsTo Ceremony via ceremonyId
  ceremony!: Ceremony;
  getCeremony!: Sequelize.BelongsToGetAssociationMixin<Ceremony>;
  setCeremony!: Sequelize.BelongsToSetAssociationMixin<Ceremony, CeremonyId>;
  createCeremony!: Sequelize.BelongsToCreateAssociationMixin<Ceremony>;
  // Circuit hasMany Contribution via circuitId
  contributions!: Contribution[];
  getContributions!: Sequelize.HasManyGetAssociationsMixin<Contribution>;
  setContributions!: Sequelize.HasManySetAssociationsMixin<Contribution, ContributionId>;
  addContribution!: Sequelize.HasManyAddAssociationMixin<Contribution, ContributionId>;
  addContributions!: Sequelize.HasManyAddAssociationsMixin<Contribution, ContributionId>;
  createContribution!: Sequelize.HasManyCreateAssociationMixin<Contribution>;
  removeContribution!: Sequelize.HasManyRemoveAssociationMixin<Contribution, ContributionId>;
  removeContributions!: Sequelize.HasManyRemoveAssociationsMixin<Contribution, ContributionId>;
  hasContribution!: Sequelize.HasManyHasAssociationMixin<Contribution, ContributionId>;
  hasContributions!: Sequelize.HasManyHasAssociationsMixin<Contribution, ContributionId>;
  countContributions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Circuit {
    return Circuit.init(
      {
        ceremonyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'ceremonies',
            key: 'id',
          },
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        timeoutMechanismType: {
          type: DataTypes.TEXT /* Enum: CIRCUIT_TIMEOUT_TYPE */,
          allowNull: false,
          defaultValue: 'FIXED',
        },
        dynamicThreshold: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        fixedTimeWindow: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sequencePosition: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        zKeySizeInBytes: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        constraints: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        pot: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        averageContributionComputationTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        averageFullContributionTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        averageVerifyContributionTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        compiler: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        template: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        verification: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        artifacts: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        files: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'circuits',
        timestamps: false,
      },
    );
  }
}
