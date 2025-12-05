const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8067";

export interface Circuit {
  id: number;
  ceremonyId: number;
  name: string;
  timeoutMechanismType: "DYNAMIC" | "FIXED" | "LOBBY";
  dynamicThreshold?: number;
  fixedTimeWindow?: number;
  sequencePosition: number;
  zKeySizeInBytes?: number;
  constraints?: number;
  pot?: number;
  averageContributionComputationTime?: number;
  averageFullContributionTime?: number;
  averageVerifyContributionTime?: number;
  completedContributions: number;
  failedContributions: number;
  currentContributor?: number;
  contributors?: any[];
  compiler?: any;
  template?: any;
  verification: any;
  artifacts: any;
  metadata?: any;
  files?: any;
}

export const circuitsApi = {
  async findByCeremony(ceremonyId: number): Promise<Circuit[]> {
    const response = await fetch(
      `${API_URL}/circuits?ceremonyId=${ceremonyId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ceremony circuits");
    }

    return response.json();
  },

  async findOne(id: number): Promise<Circuit> {
    const response = await fetch(`${API_URL}/circuits/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch circuit");
    }

    return response.json();
  },
};

// Helper function to transform circuit data for Live Stats display
export const formatCircuitForLiveStats = (circuit: Circuit) => ({
  title: circuit.name,
  completed: circuit.completedContributions || 0,
  memoryRequired: Math.round((circuit.zKeySizeInBytes || 0) / 1024 / 1024) || 0, // Convert bytes to MB
  avgContributionTime: circuit.averageContributionComputationTime || 0,
  maxContributionTime: circuit.averageFullContributionTime || 0, // Using full time as max
});
