// TypeScript type definitions for ceremonies module

// Enums (imported from backend, duplicated here for CLI typing)
export enum CeremonyType {
  PHASE1 = "PHASE1",
  PHASE2 = "PHASE2",
}

export enum CeremonyState {
  SCHEDULED = "SCHEDULED",
  OPENED = "OPENED",
  PAUSED = "PAUSED",
  CLOSED = "CLOSED",
  CANCELED = "CANCELED",
  FINALIZED = "FINALIZED",
}

// Ceremony creation template (matches CreateCeremonyDto)
export interface CeremonyCreate {
  projectId: number;
  description?: string;
  type: CeremonyType;
  state: CeremonyState;
  start_date: number;
  end_date: number;
  penalty: number;
  authProviders: Record<string, boolean>;
}

// Ceremony update template (matches UpdateCeremonyDto, all fields optional except id)
export interface CeremonyUpdate {
  description?: string;
  type?: CeremonyType;
  state?: CeremonyState;
  start_date?: number;
  end_date?: number;
  penalty?: number;
  authProviders?: Record<string, boolean>;
}

// Ceremony API response (matches backend model)
export interface Ceremony {
  id: number;
  projectId: number;
  description?: string;
  type: CeremonyType;
  state: CeremonyState;
  start_date: number;
  end_date: number;
  penalty: number;
  authProviders: Record<string, boolean>;
}
