import { useQuery } from "@tanstack/react-query";

const contributors = [
  {
    doc: "stark_verify_00001.zkey",
    contributor: "0x1234567890123456789012345678901234567890",
    contributionDate: "2021-01-01",
    id: "1234567890123456789012345678901234567890",
  },
  {
    doc: "stark_verify_00002.zkey",
    contributor: "0x1234567890123456789012345678901234567890",
    contributionDate: "2021-01-01",
    id: "1234567890123456789012345678901234567890",
  },
  {
    doc: "stark_verify_00003.zkey",
    contributor: "0x1234567890123456789012345678901234567890",
    contributionDate: "2021-01-01",
    id: "1234567890123456789012345678901234567890",
  },
  {
    doc: "stark_verify_00004.zkey",
    contributor: "0x1234567890123456789012345678901234567890",
    contributionDate: "2021-01-01",
    id: "1234567890123456789012345678901234567890",
  },
  {
    doc: "stark_verify_00005.zkey",
    contributor: "0x1234567890123456789012345678901234567890",
    contributionDate: "2021-01-01",
    id: "1234567890123456789012345678901234567890",
  },
  {
    doc: "stark_verify_00007.zkey",
    contributor: "0x1234567890123456789012345678901234567890",
    contributionDate: "2021-01-01",
    id: "1234567890123456789012345678901234567890",
  },
];

export const useGetCeremonyContributors = (id: string | number) => {
  return useQuery({
    queryKey: ["ceremony-contributors", id],
    queryFn: () => {
      return contributors;
    },
  });
};
