import { Optional } from 'sequelize';
import { Column, DataType, Model, Table, HasMany, Index } from 'sequelize-typescript';
import { UserProvider } from 'src/types/enums';
import { Project } from 'src/projects/project.model';
import { Participant } from 'src/participants/participant.model';

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

/**
 * User model with multi-provider OAuth support
 *
 * User lookup strategy: (displayName + provider) composite key
 *
 * For optimal performance, consider adding this database index:
 * CREATE INDEX idx_user_provider_displayname ON users(provider, displayName);
 *
 * This index dramatically improves login performance and enables:
 * - Fast provider-specific user lookups
 * - Efficient authentication queries
 * - Prevention of duplicate users per provider
 */
