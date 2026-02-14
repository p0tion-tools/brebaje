/**
 * Interface for project creation data from JSON template.
 */
export interface ProjectCreate {
  name: string;
  contact: string;
}

/**
 * Interface for project data from API.
 */
export interface Project {
  id: number;
  name: string;
  contact: string;
  coordinatorId: number;
  creationTime?: number;
  lastUpdated?: number;
}
