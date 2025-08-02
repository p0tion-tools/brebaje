import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ProjectAttributes {
  id?: number;
  name?: string;
  contact?: string;
  coordinatorId: number;
}

export type ProjectPk = 'id';
export type ProjectId = Project[ProjectPk];
export type ProjectOptionalAttributes = 'id' | 'name' | 'contact';
export type ProjectCreationAttributes = Optional<ProjectAttributes, ProjectOptionalAttributes>;

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  id?: number;
  name?: string;
  contact?: string;
  coordinatorId!: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof Project {
    return Project.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        contact: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        coordinatorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'projects',
        timestamps: false,
      },
    );
  }
}
