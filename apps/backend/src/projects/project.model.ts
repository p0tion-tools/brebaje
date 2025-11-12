import { Optional } from 'sequelize';
import { Column, DataType, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from 'src/users/user.model';
import { Ceremony } from 'src/ceremonies/ceremony.model';

export interface ProjectAttributes {
  id?: number;
  name: string;
  contact: string;
  coordinatorId: number;
  createdDate: number;
}

export type ProjectPk = 'id';
export type ProjectId = Project[ProjectPk];
export type ProjectOptionalAttributes = 'id';
export type ProjectCreationAttributes = Optional<ProjectAttributes, ProjectOptionalAttributes>;

@Table({ tableName: 'projects' })
export class Project extends Model implements ProjectAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'title in the frontend',
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'E.g.: nicoserranop (Discord)',
  })
  declare contact: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare coordinatorId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare createdDate: number;

  @BelongsTo(() => User, 'coordinatorId')
  declare user: User;

  @HasMany(() => Ceremony, 'projectId')
  declare ceremonies: Ceremony[];
}
