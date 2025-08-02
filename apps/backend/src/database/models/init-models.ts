import type { Sequelize } from 'sequelize';
import { Ceremony as _Ceremony } from './ceremony';
import type { CeremonyAttributes, CeremonyCreationAttributes } from './ceremony';
import { Project as _Project } from './project';
import type { ProjectAttributes, ProjectCreationAttributes } from './project';

export { _Ceremony as Ceremony, _Project as Project };

export type {
  CeremonyAttributes,
  CeremonyCreationAttributes,
  ProjectAttributes,
  ProjectCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Ceremony = _Ceremony.initModel(sequelize);
  const Project = _Project.initModel(sequelize);

  return {
    Ceremony: Ceremony,
    Project: Project,
  };
}
