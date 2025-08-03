import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ceremony, CeremonyId } from 'src/ceremonies/ceremony.model';
import type { User, UserId } from 'src/users/user.model';

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

  // Project hasMany Ceremony via projectId
  ceremonies!: Ceremony[];
  getCeremonies!: Sequelize.HasManyGetAssociationsMixin<Ceremony>;
  setCeremonies!: Sequelize.HasManySetAssociationsMixin<Ceremony, CeremonyId>;
  addCeremony!: Sequelize.HasManyAddAssociationMixin<Ceremony, CeremonyId>;
  addCeremonies!: Sequelize.HasManyAddAssociationsMixin<Ceremony, CeremonyId>;
  createCeremony!: Sequelize.HasManyCreateAssociationMixin<Ceremony>;
  removeCeremony!: Sequelize.HasManyRemoveAssociationMixin<Ceremony, CeremonyId>;
  removeCeremonies!: Sequelize.HasManyRemoveAssociationsMixin<Ceremony, CeremonyId>;
  hasCeremony!: Sequelize.HasManyHasAssociationMixin<Ceremony, CeremonyId>;
  hasCeremonies!: Sequelize.HasManyHasAssociationsMixin<Ceremony, CeremonyId>;
  countCeremonies!: Sequelize.HasManyCountAssociationsMixin;
  // Project belongsTo User via coordinatorId
  coordinator!: User;
  getCoordinator!: Sequelize.BelongsToGetAssociationMixin<User>;
  setCoordinator!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createCoordinator!: Sequelize.BelongsToCreateAssociationMixin<User>;

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
          references: {
            model: 'users',
            key: 'id',
          },
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
