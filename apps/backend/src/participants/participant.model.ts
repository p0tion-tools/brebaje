import { Optional } from 'sequelize';
import { Column, DataType, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { ParticipantStatus, ParticipantContributionStep } from 'src/types/enums';
import { User } from 'src/users/user.model';
import { Ceremony } from 'src/ceremonies/ceremony.model';
import { Contribution } from 'src/contributions/contribution.model';

export interface ParticipantAttributes {
  userId: number;
  ceremonyId: number;
  id?: number;
  status: ParticipantStatus;
  contributionStep: ParticipantContributionStep;
  contributionProgress?: number;
  contributionStartedAt?: number;
  verificationStartedAt?: number;
  tempContributionData?: object;
  timeout?: object;
}

export type ParticipantPk = 'id';
export type ParticipantId = Participant[ParticipantPk];
export type ParticipantOptionalAttributes =
  | 'id'
  | 'status'
  | 'contributionProgress'
  | 'contributionStartedAt'
  | 'verificationStartedAt'
  | 'tempContributionData'
  | 'timeout';
export type ParticipantCreationAttributes = Optional<
  ParticipantAttributes,
  ParticipantOptionalAttributes
>;

@Table({ tableName: 'participants' })
export class Participant extends Model implements ParticipantAttributes {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare ceremonyId: number;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id?: number;

  @Column({
    type: DataType.ENUM(...Object.values(ParticipantStatus)),
    allowNull: false,
    defaultValue: ParticipantStatus.CREATED,
  })
  declare status: ParticipantStatus;

  @Column({
    type: DataType.ENUM(...Object.values(ParticipantContributionStep)),
    allowNull: false,
  })
  declare contributionStep: ParticipantContributionStep;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare contributionProgress?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare contributionStartedAt?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare verificationStartedAt?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare tempContributionData?: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Array of timeouts. Check Timeout class',
  })
  declare timeout?: object;

  @BelongsTo(() => User, 'userId')
  declare user: User;

  @BelongsTo(() => Ceremony, 'ceremonyId')
  declare ceremony: Ceremony;

  @HasMany(() => Contribution, 'participantId')
  declare contributions: Contribution[];
}
