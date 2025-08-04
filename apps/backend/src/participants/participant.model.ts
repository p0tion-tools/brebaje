import { Optional } from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Ceremony } from 'src/ceremonies/ceremony.model';
import { Contribution } from 'src/contributions/contribution.model';
import { ParticipantContributionStep, ParticipantStatus } from 'src/types/enums';
import { User } from 'src/users/user.model';

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
    primaryKey: true,
    autoIncrement: true,
  })
  declare id?: number;

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
  tempContributionData?: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Array of timeouts. Check Timeout class',
  })
  timeout?: any;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Ceremony, 'ceremonyId')
  ceremony: Ceremony;

  @HasMany(() => Contribution, 'participantId')
  contributions: Contribution[];
}
