import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Participant, ParticipantId } from './participant';
import type { Project, ProjectId } from './project';

export interface UserAttributes {
  id?: number;
  displayName?: string;
  creationTime?: number;
  lastSignInTime?: number;
  lastUpdated?: number;
  avatarUrl?: number;
  provider?: string;
}

export type UserPk = 'id';
export type UserId = User[UserPk];
export type UserOptionalAttributes =
  | 'id'
  | 'displayName'
  | 'creationTime'
  | 'lastSignInTime'
  | 'lastUpdated'
  | 'avatarUrl'
  | 'provider';
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id?: number;
  displayName?: string;
  creationTime?: number;
  lastSignInTime?: number;
  lastUpdated?: number;
  avatarUrl?: number;
  provider?: string;

  // User hasMany Participant via userId
  participants!: Participant[];
  getParticipants!: Sequelize.HasManyGetAssociationsMixin<Participant>;
  setParticipants!: Sequelize.HasManySetAssociationsMixin<Participant, ParticipantId>;
  addParticipant!: Sequelize.HasManyAddAssociationMixin<Participant, ParticipantId>;
  addParticipants!: Sequelize.HasManyAddAssociationsMixin<Participant, ParticipantId>;
  createParticipant!: Sequelize.HasManyCreateAssociationMixin<Participant>;
  removeParticipant!: Sequelize.HasManyRemoveAssociationMixin<Participant, ParticipantId>;
  removeParticipants!: Sequelize.HasManyRemoveAssociationsMixin<Participant, ParticipantId>;
  hasParticipant!: Sequelize.HasManyHasAssociationMixin<Participant, ParticipantId>;
  hasParticipants!: Sequelize.HasManyHasAssociationsMixin<Participant, ParticipantId>;
  countParticipants!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany Project via coordinatorId
  projects!: Project[];
  getProjects!: Sequelize.HasManyGetAssociationsMixin<Project>;
  setProjects!: Sequelize.HasManySetAssociationsMixin<Project, ProjectId>;
  addProject!: Sequelize.HasManyAddAssociationMixin<Project, ProjectId>;
  addProjects!: Sequelize.HasManyAddAssociationsMixin<Project, ProjectId>;
  createProject!: Sequelize.HasManyCreateAssociationMixin<Project>;
  removeProject!: Sequelize.HasManyRemoveAssociationMixin<Project, ProjectId>;
  removeProjects!: Sequelize.HasManyRemoveAssociationsMixin<Project, ProjectId>;
  hasProject!: Sequelize.HasManyHasAssociationMixin<Project, ProjectId>;
  hasProjects!: Sequelize.HasManyHasAssociationsMixin<Project, ProjectId>;
  countProjects!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true,
        },
        displayName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        creationTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        lastSignInTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        lastUpdated: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        avatarUrl: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        provider: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: false,
      },
    );
  }
}
