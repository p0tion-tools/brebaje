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
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ceremonyId: number;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: true,
  })
  declare id?: number;

  @Column({
    type: DataType.ENUM(...Object.values(ParticipantStatus)),
    allowNull: false,
    defaultValue: ParticipantStatus.CREATED,
  })
  status: ParticipantStatus;

  @Column({
    type: DataType.ENUM(...Object.values(ParticipantContributionStep)),
    allowNull: false,
  })
  contributionStep: ParticipantContributionStep;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  contributionProgress?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  contributionStartedAt?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  verificationStartedAt?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  tempContributionData?: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Array of timeouts. Check Timeout class]',
  })
  timeout?: object;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Ceremony, 'ceremonyId')
  ceremony: Ceremony;

  @HasMany(() => Contribution, 'participantId')
  contributions: Contribution[];
}
