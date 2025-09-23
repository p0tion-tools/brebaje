import { Optional } from 'sequelize';
import { Column, DataType, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { CeremonyType, CeremonyState } from 'src/types/enums';
import { Project } from 'src/projects/project.model';
import { Circuit } from 'src/circuits/circuit.model';
import { Participant } from 'src/participants/participant.model';

export interface CeremonyAttributes {
  projectId: number;
  id?: number;
  description?: string;
  type: CeremonyType;
  state: CeremonyState;
  start_date: number;
  end_date: number;
  penalty: number;
  authProviders: object;
}

export type CeremonyPk = 'id';
export type CeremonyId = Ceremony[CeremonyPk];
export type CeremonyOptionalAttributes = 'id' | 'description' | 'type' | 'state';
export type CeremonyCreationAttributes = Optional<CeremonyAttributes, CeremonyOptionalAttributes>;

@Table({ tableName: 'ceremonies' })
export class Ceremony extends Model implements CeremonyAttributes {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare projectId: number;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'description in the frontend',
  })
  declare description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(CeremonyType)),
    allowNull: false,
    defaultValue: CeremonyType.PHASE2,
  })
  declare type: CeremonyType;

  @Column({
    type: DataType.ENUM(...Object.values(CeremonyState)),
    allowNull: false,
    defaultValue: CeremonyState.SCHEDULED,
  })
  declare state: CeremonyState;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare start_date: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare end_date: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare penalty: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: 'check auth providers classes',
  })
  declare authProviders: object;

  @BelongsTo(() => Project, 'projectId')
  declare project: Project;

  @HasMany(() => Circuit, 'ceremonyId')
  declare circuits: Circuit[];

  @HasMany(() => Participant, 'ceremonyId')
  declare participants: Participant[];
}
