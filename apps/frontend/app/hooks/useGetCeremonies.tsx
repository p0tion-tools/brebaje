/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ceremonies } from "@/mocks/ceremonies.mocks";
import { useQuery } from "@tanstack/react-query";
import { Ceremony } from "../types";

const fetchOpenCeremonies = async (): Promise<any> => {
  return ceremonies.filter((ceremony: any) => ceremony.isActive);
};

const fetchClosedCeremonies = async (): Promise<any> => {
  return ceremonies.filter((ceremony: any) => !ceremony.isActive);
};

export const useGetOpenCeremonies = () => {
  return useQuery({
    queryKey: ["ceremonies", "open"],
    queryFn: async () => {
      const ceremonies = await fetchOpenCeremonies();
      return ceremonies.map((ceremony: Ceremony) => {
        return {
          id: ceremony.id,
          title: ceremony.title,
          description: ceremony.description,
          isActive: ceremony.isActive,
          startDate: ceremony.startDate?.toString(),
          endDate: ceremony.endDate?.toString(),
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
      return ceremonies.map((ceremony: Ceremony) => {
        return {
          id: ceremony.id,
          title: ceremony.title,
          description: ceremony.description,
          isActive: ceremony.isActive,
          startDate: ceremony.startDate?.toString(),
          endDate: ceremony.endDate?.toString(),
        };
      });
    },
  });
};
