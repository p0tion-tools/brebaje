import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CeremonyAttributes {
  projectId: number;
  id?: number;
  description?: string;
  state?: string;
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
  state?: string;
  start_date?: number;
  end_date?: number;
  penalty?: number;
  authProviders?: object;

  static initModel(sequelize: Sequelize.Sequelize): typeof Ceremony {
    return Ceremony.init(
      {
        projectId: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        state: {
          type: DataTypes.TEXT,
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
