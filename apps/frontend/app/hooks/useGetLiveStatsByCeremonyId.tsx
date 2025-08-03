import { useQuery } from "@tanstack/react-query";

const liveStats = [
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
    queryFn: () => {
      return liveStats;
    },
  });
};
