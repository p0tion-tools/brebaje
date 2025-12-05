import { ceremonies } from "@/mocks/ceremonies.mocks";
import { ceremoniesApi } from "@/app/lib/api/ceremonies";
import { useQuery } from "@tanstack/react-query";

export const useGetCeremonyById = (id: string) => {
  return useQuery({
    queryKey: ["ceremony", id],
    queryFn: async () => {
      const ceremonyId = Number(id);
      if (isNaN(ceremonyId)) {
        throw new Error("Invalid ceremony ID");
      }

      // First, try to fetch from API (real ceremonies take priority)
      try {
        const ceremony = await ceremoniesApi.findOne(ceremonyId);

        // Transform the data to match the expected format for the existing UI
        return {
          id: ceremony.id,
          title: ceremony.description,
          description: `Zero-knowledge proof trusted setup for ${ceremony.type} ceremony`,
          isActive: ceremony.state === "OPENED",
          startDate: new Date(ceremony.start_date * 1000),
          endDate: new Date(ceremony.end_date * 1000),
          // Real ceremony statistics (show actual data, blank if not available)
          totalContributions: 0, // Would come from contributions count
          peopleInQueue: 0, // Would come from participants count
          avgContributionTime: "", // Would come from average contribution time calculation
          penalty: ceremony.penalty, // Real penalty value from ceremony
        };
      } catch (error) {
        // If not found in API, fall back to mock data (homepage ceremonies)
        const mockCeremony = ceremonies.find((c: any) => c.id === ceremonyId);
        if (mockCeremony) {
          return {
            ...mockCeremony,
            // Ensure mock ceremonies have all required properties
            totalContributions: 0,
            peopleInQueue: 0,
            avgContributionTime: "",
            penalty: 0,
          };
        }

        throw new Error("Ceremony not found");
      }
    },
    enabled: !!id,
  });
};
