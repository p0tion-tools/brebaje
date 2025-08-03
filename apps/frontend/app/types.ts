export interface Ceremony {
  id: string | number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}
