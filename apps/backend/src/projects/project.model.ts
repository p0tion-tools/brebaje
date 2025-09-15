import { Optional } from 'sequelize';
import { Column, DataType, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from 'src/users/user.model';
import { Ceremony } from 'src/ceremonies/ceremony.model';

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
    allowNull: true,
  })
  declare id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'title in the frontend]',
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'E.g.: nicoserranop (Discord)]',
  })
  contact: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  coordinatorId: number;

  @BelongsTo(() => User, 'coordinatorId')
  user: User;

  @HasMany(() => Ceremony, 'projectId')
  ceremonies: Ceremony[];
}
