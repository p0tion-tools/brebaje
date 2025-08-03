import { useQuery } from "@tanstack/react-query";
import { LINKS } from "../config";

const ceremonyAbouts = [
  {
    title: "SemaphoreV4 / max_depth = 1",
    parameters: 1,
    commitHash: "0x1234567890123456789012345678901234567890",
    templateLink: LINKS.GITHUB,
  },
  {
    title: "SemaphoreV4 / max_depth = 2",
    parameters: 1,
    commitHash: "0x1234567890123456789012345678901234567890",
    templateLink: LINKS.GITHUB,
  },
  {
    title: "SemaphoreV4 / max_depth = 3",
    parameters: 1,
    commitHash: "0x1234567890123456789012345678901234567890",
    templateLink: LINKS.GITHUB,
  },
  {
    title: "SemaphoreV4 / max_depth = 4",
    parameters: 1,
    commitHash: "0x1234567890123456789012345678901234567890",
    templateLink: LINKS.GITHUB,
  },
  {
    title: "SemaphoreV4 / max_depth = 5",
    parameters: 1,
    commitHash: "0x1234567890123456789012345678901234567890",
    templateLink: LINKS.GITHUB,
  },
];

export const useGetCeremonyAbout = (id: string | number) => {
  return useQuery({
    queryKey: ["ceremony-about", id],
    queryFn: () => {
      return ceremonyAbouts;
    },
  });
};
