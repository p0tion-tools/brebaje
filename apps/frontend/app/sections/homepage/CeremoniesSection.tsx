"use client";

import Image from "next/image";
import { AppContent } from "@/app/components/layouts/AppContent";
import { Card } from "@/app/components/ui/Card";
import { Icons } from "@/app/components/shared/Icons";
import { CeremonyCard } from "@/app/components/CeremonyCard";
import {
  useGetClosedCeremonies,
  useGetOpenCeremonies,
} from "@/app/hooks/useGetCeremonies";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { MAX_CLOSED_CEREMONIES_WITHOUT_EXPAND } from "@/app/config";
import Link from "next/link";
import { Ceremony } from "@/app/types";

export const CeremoniesSection = () => {
  const [showAllClosedExpanded, setShowAllClosedExpanded] = useState(false);
  const { data: openCeremonies = [] } = useGetOpenCeremonies();
  const { data: closedCeremonies = [] } = useGetClosedCeremonies();

  const showAllClosedCeremonies =
    closedCeremonies.length > MAX_CLOSED_CEREMONIES_WITHOUT_EXPAND &&
    showAllClosedExpanded;

  const filteredClosedCeremonies = showAllClosedCeremonies
    ? closedCeremonies
    : closedCeremonies.slice(0, MAX_CLOSED_CEREMONIES_WITHOUT_EXPAND);

  return (
    <div className="bg-light-base">
      <AppContent className="flex flex-col gap-14 py-[120px]">
        <Card
          title="Open ceremonies"
          actions={<Icons.ActiveCeremonies />}
          radius="sm"
          size="lg"
          withDivider
        >
          <div className="grid grid-cols-1 gap-5 lg:gap-[30px] lg:grid-cols-2">
            {openCeremonies.map((ceremony: Ceremony) => (
              <Link
                href={`/ceremonies/${ceremony.id}`}
                key={ceremony.id}
              >
                <CeremonyCard
                  key={ceremony.id}
                  title={ceremony.title}
                  description={ceremony.description}
                  startDate={ceremony.startDate}
                  endDate={ceremony.endDate}
                  isActive
                />
              </Link>
            ))}
          </div>
        </Card>
        <Card
          title="Closed ceremonies"
          actions={<Icons.ClosedCeremonies />}
          radius="sm"
          withDivider
        >
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 gap-5 lg:gap-[30px] lg:grid-cols-3">
              {filteredClosedCeremonies.map((ceremony: Ceremony) => (
                <Link
                  href={`/ceremonies/${ceremony.id}`}
                  key={ceremony.id}
                >
                  <CeremonyCard
                    key={ceremony.id}
                    title={ceremony.title}
                    description={ceremony.description}
                    startDate={ceremony.startDate}
                    endDate={ceremony.endDate}
                    isActive={false}
                  />
                </Link>
              ))}
            </div>
            <Button
              className="uppercase mx-auto"
              variant="black"
              icon={<Icons.ArrowDown />}
              iconPosition="right"
              onClick={() => setShowAllClosedExpanded(!showAllClosedExpanded)}
            >
              Show more
            </Button>
          </div>
        </Card>
        <Image
          src="/illustrations/double-circle.svg"
          alt="double circle"
          width={200}
          height={100}
        />
      </AppContent>
    </div>
  );
};
