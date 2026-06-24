import { Column, DataType, Model, Table, HasMany, Index } from 'sequelize-typescript';
import { UserProvider } from 'src/types/enums';
import { Project } from 'src/projects/project.model';
import { Participant } from 'src/participants/participant.model';

/** Caller-supplied fields only. DB-managed fields (id, timestamps) are excluded. */
export interface UserAttributes {
  displayName: string;
  provider: UserProvider;
  walletAddress?: string;
  avatarUrl?: string;
}

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id?: number;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare displayName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare creationTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare lastSignInTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare lastUpdated?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare avatarUrl?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare walletAddress?: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserProvider)),
    allowNull: false,
    defaultValue: UserProvider.GITHUB,
  })
  declare provider: UserProvider;

  @HasMany(() => Project, 'coordinatorId')
  declare projects: Project[];

  @HasMany(() => Participant, 'userId')
  declare participants: Participant[];
}
