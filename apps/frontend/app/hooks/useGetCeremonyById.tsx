/* eslint-disable @typescript-eslint/no-explicit-any */

import { ceremonies } from "@/mocks/ceremonies.mocks";
import { useQuery } from "@tanstack/react-query";

export const useGetCeremonyById = (id: string) => {
  return useQuery({
    queryKey: ["ceremony", id],
    queryFn: () => {
      const ceremony = ceremonies.find((c: any) => c.id === Number(id));

      return ceremony;
    },
  });
};
