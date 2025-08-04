import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Index, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Participant } from 'src/participants/participant.model';
import { Project } from 'src/projects/project.model';
import { UserProvider } from 'src/types/enums';

export interface UserAttributes {
  id?: number;
  displayName: string;
  creationTime: number;
  lastSignInTime?: number;
  lastUpdated?: number;
  avatarUrl?: string;
  provider: UserProvider;
}

export type UserPk = 'id';
export type UserId = User[UserPk];
export type UserOptionalAttributes =
  | 'id'
  | 'lastSignInTime'
  | 'lastUpdated'
  | 'avatarUrl'
  | 'provider';
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

@Table({ tableName: 'users' })
export class User extends Model implements UserAttributes {
  @PrimaryKey
  @Column
  declare id?: number;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  displayName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  creationTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  lastSignInTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  lastUpdated?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatarUrl?: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserProvider)),
    allowNull: false,
    defaultValue: UserProvider.GITHUB,
  })
  provider: UserProvider;

  @HasMany(() => Project, 'coordinatorId')
  projects: Project[];

  @HasMany(() => Participant, 'userId')
  participants: Participant[];
}
