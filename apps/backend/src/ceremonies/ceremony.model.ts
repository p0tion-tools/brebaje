import * as Sequelize from 'sequelize';

export enum ceremonyState {
  SCHEDULED = 'SCHEDULED',
  OPENED = 'OPENED',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
  FINALIZED = 'FINALIZED',
}
export enum ceremonyType {
  PHASE1 = 'PHASE1',
  PHASE2 = 'PHASE2',
}
import { DataTypes, Model, Optional } from 'sequelize';
import type { Circuit, CircuitId } from 'src/circuits/circuit.model';
import type { Participant, ParticipantId } from 'src/participants/participant.model';
import type { Project, ProjectId } from 'src/projects/project.model';

export interface CeremonyAttributes {
  projectId: number;
  id?: number;
  description?: string;
  type?: ceremonyType;
  state?: ceremonyState;
  start_date?: number;
  end_date?: number;
  penalty?: number;
  authProviders?: object;
}

export type CeremonyPk = 'id';
export type CeremonyId = Ceremony[CeremonyPk];
export type CeremonyOptionalAttributes =
  | 'id'
  | 'description'
  | 'type'
  | 'state'
  | 'start_date'
  | 'end_date'
  | 'penalty'
  | 'authProviders';
export type CeremonyCreationAttributes = Optional<CeremonyAttributes, CeremonyOptionalAttributes>;

export class Ceremony
  extends Model<CeremonyAttributes, CeremonyCreationAttributes>
  implements CeremonyAttributes
{
  projectId!: number;
  id?: number;
  description?: string;
  type?: ceremonyType;
  state?: ceremonyState;
  start_date?: number;
  end_date?: number;
  penalty?: number;
  authProviders?: object;

  // Ceremony hasMany Circuit via ceremonyId
  circuits!: Circuit[];
  getCircuits!: Sequelize.HasManyGetAssociationsMixin<Circuit>;
  setCircuits!: Sequelize.HasManySetAssociationsMixin<Circuit, CircuitId>;
  addCircuit!: Sequelize.HasManyAddAssociationMixin<Circuit, CircuitId>;
  addCircuits!: Sequelize.HasManyAddAssociationsMixin<Circuit, CircuitId>;
  createCircuit!: Sequelize.HasManyCreateAssociationMixin<Circuit>;
  removeCircuit!: Sequelize.HasManyRemoveAssociationMixin<Circuit, CircuitId>;
  removeCircuits!: Sequelize.HasManyRemoveAssociationsMixin<Circuit, CircuitId>;
  hasCircuit!: Sequelize.HasManyHasAssociationMixin<Circuit, CircuitId>;
  hasCircuits!: Sequelize.HasManyHasAssociationsMixin<Circuit, CircuitId>;
  countCircuits!: Sequelize.HasManyCountAssociationsMixin;
  // Ceremony hasMany Participant via ceremonyId
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
  // Ceremony belongsTo Project via projectId
  project!: Project;
  getProject!: Sequelize.BelongsToGetAssociationMixin<Project>;
  setProject!: Sequelize.BelongsToSetAssociationMixin<Project, ProjectId>;
  createProject!: Sequelize.BelongsToCreateAssociationMixin<Project>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Ceremony {
    return Ceremony.init(
      {
        projectId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'projects',
            key: 'id',
          },
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        type: {
          type: DataTypes.TEXT /* Enum: ceremonyType */,
          allowNull: true,
          defaultValue: 'PHASE2',
        },
        state: {
          type: DataTypes.TEXT /* Enum: ceremonyState */,
          allowNull: true,
          defaultValue: 'SCHEDULED',
        },
        start_date: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        end_date: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        penalty: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        authProviders: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'ceremonies',
        timestamps: false,
      },
    );
  }
}
