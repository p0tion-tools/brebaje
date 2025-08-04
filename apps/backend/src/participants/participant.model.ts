import * as Sequelize from 'sequelize';

export enum PARTICIPANT_CONTRIBUTION_STEP {
  DOWNLOADING = 'DOWNLOADING',
  COMPUTING = 'COMPUTING',
  UPLOADING = 'UPLOADING',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
}
export enum PARTICIPANT_STATUS {
  CREATED = 'CREATED',
  WAITING = 'WAITING',
  READY = 'READY',
  CONTRIBUTING = 'CONTRIBUTING',
  CONTRIBUTED = 'CONTRIBUTED',
  DONE = 'DONE',
  FINALIZING = 'FINALIZING',
  FINALIZED = 'FINALIZED',
  TIMEDOUT = 'TIMEDOUT',
  EXHUMED = 'EXHUMED',
}
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ceremony, CeremonyId } from 'src/ceremonies/ceremony.model';
import type { Contribution, ContributionId } from 'src/contributions/contribution.model';
import type { User, UserId } from 'src/users/user.model';

export interface ParticipantAttributes {
  userId: number;
  ceremonyId: number;
  id?: number;
  status: PARTICIPANT_STATUS;
  contributionStep: PARTICIPANT_CONTRIBUTION_STEP;
  contributionProgress?: number;
  contributionStartedAt?: number;
  verificationStartedAt?: number;
  tempContributionData?: object;
  timeout?: object;
}

export type ParticipantPk = 'id';
export type ParticipantId = Participant[ParticipantPk];
export type ParticipantOptionalAttributes =
  | 'id'
  | 'status'
  | 'contributionProgress'
  | 'contributionStartedAt'
  | 'verificationStartedAt'
  | 'tempContributionData'
  | 'timeout';
export type ParticipantCreationAttributes = Optional<
  ParticipantAttributes,
  ParticipantOptionalAttributes
>;

export class Participant
  extends Model<ParticipantAttributes, ParticipantCreationAttributes>
  implements ParticipantAttributes
{
  userId!: number;
  ceremonyId!: number;
  id?: number;
  status!: PARTICIPANT_STATUS;
  contributionStep!: PARTICIPANT_CONTRIBUTION_STEP;
  contributionProgress?: number;
  contributionStartedAt?: number;
  verificationStartedAt?: number;
  tempContributionData?: object;
  timeout?: object;

  // Participant belongsTo Ceremony via ceremonyId
  ceremony!: Ceremony;
  getCeremony!: Sequelize.BelongsToGetAssociationMixin<Ceremony>;
  setCeremony!: Sequelize.BelongsToSetAssociationMixin<Ceremony, CeremonyId>;
  createCeremony!: Sequelize.BelongsToCreateAssociationMixin<Ceremony>;
  // Participant hasMany Contribution via participantId
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
  // Participant belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Participant {
    return Participant.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
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
        status: {
          type: DataTypes.TEXT /* Enum: PARTICIPANT_STATUS */,
          allowNull: false,
          defaultValue: 'CREATED',
        },
        contributionStep: {
          type: DataTypes.TEXT /* Enum: PARTICIPANT_CONTRIBUTION_STEP */,
          allowNull: false,
        },
        contributionProgress: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        contributionStartedAt: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        verificationStartedAt: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        tempContributionData: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        timeout: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'participants',
        timestamps: false,
      },
    );
  }
}
