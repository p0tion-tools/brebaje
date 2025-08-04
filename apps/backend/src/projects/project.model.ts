import { Optional } from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Ceremony } from 'src/ceremonies/ceremony.model';
import { User } from 'src/users/user.model';

export interface ProjectAttributes {
  id?: number;
  name: string;
  contact: string;
  coordinatorId: number;
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
  })
  declare id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'title in the frontend',
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'E.g.: nicoserranop (Discord)',
  })
  contact: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  coordinatorId: number;

  @BelongsTo(() => User, 'coordinatorId')
  coordinator: User;

  @HasMany(() => Ceremony, 'projectId')
  ceremonies: Ceremony[];
}
