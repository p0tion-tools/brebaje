import { useQuery } from "@tanstack/react-query";

const finalContributionBeacon = [
  "0x1eb07932099bc3f2572d51943300053d4a7e7dee23e8c9d19a5356e2777dbdd9",
  "0x1eb07932099bc3f2572d51943300053d4a7e7dee23e8c9d19a5356e2777dbdd9",
];
const finalZkeys = [
  {
    name: "Download semaphorev4-1_final.zkey",
    url: "https://s3.amazonaws.com/final-zkey-1",
  },
  {
    name: "Download semaphorev4-2_final.zkey",
    url: "https://s3.amazonaws.com/final-zkey-2",
  },
  {
    name: "Download semaphorev4-3_final.zkey",
    url: "https://s3.amazonaws.com/final-zkey-3",
  },
  {
    name: "Download semaphorev4-4_final.zkey",
    url: "https://s3.amazonaws.com/final-zkey-4",
  },
  {
    name: "Download semaphorev4-5_final.zkey",
    url: "https://s3.amazonaws.com/final-zkey-5",
  },
  {
    name: "Download semaphorev4-6_final.zkey",
    url: "https://s3.amazonaws.com/final-zkey-6",
  },
  {
    name: "Download semaphorev4-7_final.zkey",
    url: "https://s3.amazonaws.com/final-zkey-7",
  },
  {
    name: "Download semaphorev4-8_final.zkey",
    url: "https://s3.amazonaws.com/final-zkey-8",
  },
];

export const lastZkeys = [
  {
    name: "Download semaphorev4-1_last.zkey",
    url: "https://s3.amazonaws.com/last-zkey-1",
  },
  {
    name: "Download semaphorev4-2_last.zkey",
    url: "https://s3.amazonaws.com/last-zkey-2",
  },
  {
    name: "Download semaphorev4-3_last.zkey",
    url: "https://s3.amazonaws.com/last-zkey-3",
  },
  {
    name: "Download semaphorev4-4_last.zkey",
    url: "https://s3.amazonaws.com/last-zkey-4",
  },
  {
    name: "Download semaphorev4-5_last.zkey",
    url: "https://s3.amazonaws.com/last-zkey-5",
  },
  {
    name: "Download semaphorev4-6_last.zkey",
    url: "https://s3.amazonaws.com/last-zkey-6",
  },
];

export const useGetCeremonyArtifacts = () => {
  return useQuery({
    queryKey: ["ceremony-artifacts"],
    queryFn: () => {
      return {
        finalContributionBeacon,
        finalZkeys,
        lastZkeys,
      };
    },
  });
};
