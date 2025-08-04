import { Optional } from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Circuit } from 'src/circuits/circuit.model';
import { Participant } from 'src/participants/participant.model';
import { Project } from 'src/projects/project.model';
import { CeremonyState, CeremonyType } from 'src/types/enums';
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
    primaryKey: true,
    autoIncrement: true,
  })
  declare id?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  projectId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'description in the frontend',
  })
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(CeremonyType)),
    allowNull: false,
    defaultValue: CeremonyType.PHASE2,
  })
  type: CeremonyType;

  @Column({
    type: DataType.ENUM(...Object.values(CeremonyState)),
    allowNull: false,
    defaultValue: CeremonyState.SCHEDULED,
  })
  state: CeremonyState;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  start_date: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  end_date: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  penalty: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: 'check auth providers classes',
  })
  authProviders: any;

  @BelongsTo(() => Project, 'projectId')
  project: Project;

  @HasMany(() => Circuit, 'ceremonyId')
  circuits: Circuit[];

  @HasMany(() => Participant, 'ceremonyId')
  participants: Participant[];
}
