const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8067";

export interface Participant {
  id: number;
  userId: number;
  ceremonyId: number;
  status: string;
  contributionStep: string;
  contributionProgress: number;
  contributionStartedAt?: number;
  verificationStartedAt?: number;
  tempContributionData?: any;
  timeout?: any;
  user?: {
    id: number;
    displayName: string;
    avatarUrl?: string;
    provider: string;
    walletAddress?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const participantsApi = {
  async findByCeremony(ceremonyId: number): Promise<Participant[]> {
    const response = await fetch(
      `${API_URL}/ceremonies/${ceremonyId}/participants`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch participants");
    }

    return response.json();
  },

  async findAll(): Promise<Participant[]> {
    const response = await fetch(`${API_URL}/participants`);

    if (!response.ok) {
      throw new Error("Failed to fetch participants");
    }

    return response.json();
  },
};
