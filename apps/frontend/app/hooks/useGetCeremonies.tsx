"use client";

import { useQuery } from "@tanstack/react-query";
import { Ceremony } from "../types";
import { ceremoniesApi } from "../lib/api/ceremonies";

const fetchOpenCeremonies = async (): Promise<any> => {
  const allCeremonies = await ceremoniesApi.findAll();
  return allCeremonies.filter(
    (ceremony: any) =>
      ceremony.state === "OPENED" || ceremony.state === "SCHEDULED"
  );
};

const fetchClosedCeremonies = async (): Promise<any> => {
  const allCeremonies = await ceremoniesApi.findAll();
  return allCeremonies.filter(
    (ceremony: any) =>
      ceremony.state === "CLOSED" ||
      ceremony.state === "FINALIZED" ||
      ceremony.state === "CANCELED"
  );
};

export const useGetOpenCeremonies = () => {
  return useQuery({
    queryKey: ["ceremonies", "open"],
    queryFn: async () => {
      const ceremonies = await fetchOpenCeremonies();
      return ceremonies.map((ceremony: any) => {
        return {
          id: ceremony.id,
          title: ceremony.description, // API uses 'description' field
          description: ceremony.description,
          isActive: ceremony.state === "OPENED",
          startDate: new Date(ceremony.start_date * 1000)
            .toISOString()
            .split("T")[0],
          endDate: new Date(ceremony.end_date * 1000)
            .toISOString()
            .split("T")[0],
        };
      });
    },
  });
};

export const useGetClosedCeremonies = () => {
  return useQuery({
    queryKey: ["ceremonies", "closed"],
    queryFn: async () => {
      const ceremonies = await fetchClosedCeremonies();
      return ceremonies.map((ceremony: any) => {
        return {
          id: ceremony.id,
          title: ceremony.description, // API uses 'description' field
          description: ceremony.description,
          isActive: false,
          startDate: new Date(ceremony.start_date * 1000)
            .toISOString()
            .split("T")[0],
          endDate: new Date(ceremony.end_date * 1000)
            .toISOString()
            .split("T")[0],
        };
      });
    },
  });
};
