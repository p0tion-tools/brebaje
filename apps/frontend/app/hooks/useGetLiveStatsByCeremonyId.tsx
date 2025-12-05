import { circuitsApi, formatCircuitForLiveStats } from "@/app/lib/api/circuits";
import { useQuery } from "@tanstack/react-query";

const mockLiveStats = [
  {
    title: "SemaphoreV4 / max_depth = 1",
    completed: 387,
    memoryRequired: 512,
    avgContributionTime: 43,
    maxContributionTime: 65,
  },
  {
    title: "SemaphoreV4 / max_depth = 2",
    completed: 342,
    memoryRequired: 768,
    avgContributionTime: 52,
    maxContributionTime: 78,
  },
  {
    title: "SemaphoreV4 / max_depth = 3",
    completed: 298,
    memoryRequired: 1024,
    avgContributionTime: 58,
    maxContributionTime: 85,
  },
  {
    title: "SemaphoreV4 / max_depth = 4",
    completed: 256,
    memoryRequired: 1536,
    avgContributionTime: 67,
    maxContributionTime: 94,
  },
  {
    title: "SemaphoreV4 / max_depth = 5",
    completed: 213,
    memoryRequired: 2048,
    avgContributionTime: 75,
    maxContributionTime: 105,
  },
  {
    title: "SemaphoreV4 / max_depth = 6",
    completed: 178,
    memoryRequired: 3072,
    avgContributionTime: 89,
    maxContributionTime: 122,
  },
  {
    title: "SemaphoreV4 / max_depth = 7",
    completed: 145,
    memoryRequired: 4096,
    avgContributionTime: 98,
    maxContributionTime: 135,
  },
  {
    title: "SemaphoreV4 / max_depth = 8",
    completed: 112,
    memoryRequired: 6144,
    avgContributionTime: 112,
    maxContributionTime: 148,
  },
];

export const useGetLiveStatsByCeremonyId = (id: string | number) => {
  return useQuery({
    queryKey: ["live-stats", id],
    queryFn: async () => {
      const ceremonyId = Number(id);

      // Determine if this is a mock ceremony (homepage examples) or real ceremony
      const isMockCeremony = ceremonyId <= 32; // IDs 1-32 are mock ceremonies from homepage

      // For real ceremonies (created via coordinator), always try API first
      if (!isMockCeremony) {
        try {
          const circuits = await circuitsApi.findByCeremony(ceremonyId);

          // Return real circuits if found, or empty array if none
          if (circuits && circuits.length > 0) {
            return circuits.map(formatCircuitForLiveStats);
          }

          // For real ceremonies with no circuits, return empty array
          return [];
        } catch (error) {
          console.log("Error fetching circuits for real ceremony:", error);
          return []; // Return empty for real ceremonies on API error
        }
      }

      // For mock ceremonies (homepage examples), show mock circuit data
      return mockLiveStats;
    },
    enabled: !!id,
  });
};
