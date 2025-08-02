"use client";

import { Card } from "@/app/components/ui/Card";
import { useGetCeremonyContributors } from "@/app/hooks/useGetCeremonyContributors";
import { shortAddress } from "@/app/lib/utils";
import { classed } from "@tw-classed/react";
import { useParams } from "next/navigation";

const TableWrapper = classed.div("grid grid-cols-[1fr_1fr_1fr_50px] gap-2");
const TableHeader = classed.span("text-lg text-black uppercase font-bold");

export const ContributionsSection = () => {
  const { id } = useParams();

  const { data: contributors } = useGetCeremonyContributors(id as string);

  const formatDate = (date: string) => {
    return new Date(date)
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(",", " -");
  };

  return (
    <Card
      radius="xs"
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <TableWrapper>
          <TableHeader>Doc</TableHeader>
          <TableHeader>Contributor</TableHeader>
          <TableHeader>Contribution Date</TableHeader>
          <TableHeader>ID</TableHeader>
        </TableWrapper>
        <div className="flex flex-col gap-[14px]">
          {contributors?.map((contributor) => (
            <Card
              key={contributor.id}
              variant="secondary"
              radius="xxs"
              size="xxs"
            >
              <TableWrapper key={contributor.id}>
                <span className="text-sm text-black">{contributor.doc}</span>
                <span className="text-sm text-black">
                  {shortAddress(contributor.contributor)}
                </span>
                <span className="text-sm text-black">
                  {formatDate(contributor.contributionDate)}
                </span>
                <span className="text-sm text-black"></span>
              </TableWrapper>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
