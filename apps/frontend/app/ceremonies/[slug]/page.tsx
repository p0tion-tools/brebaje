"use client";

import { AttributeCard } from "@/app/components/AttributeCard";
import { AppContent } from "@/app/components/layouts/AppContent";
import { Card } from "@/app/components/ui/Card";
import { Chip } from "@/app/components/ui/Chip";
import { Tabs } from "@/app/components/ui/Tabs";
import Image from "next/image";
import { useParams } from "next/navigation";
// import { ceremonies } from "@/mocks/ceremonies.mocks";
// import { useMemo } from "react";
import { CeremonyDate } from "@/app/components/CeremonyDate";
import { Button } from "@/app/components/ui/Button";
import { LiveStatsSection } from "@/app/sections/ceremonies/LiveStatsSection";
import { ContributionsSection } from "@/app/sections/ceremonies/ContributionsSection";
import { AboutSection } from "@/app/sections/ceremonies/AboutSection";
import { DownloadZkeySection } from "@/app/sections/ceremonies/DownloadZkeySection";
import { useGetCeremonyById } from "@/app/hooks/useGetCeremonyById";

export default function ProjectPage() {
  const { slug } = useParams();
  const { data: ceremony, isLoading } = useGetCeremonyById(slug as string);

  return (
    <AppContent
      containerClassName="bg-light-base py-[140px] min-h-screen"
      className="grid grid-cols-[260px_1fr] gap-10"
    >
      <div className="flex flex-col h-[calc(100vh-280px)] sticky top-[140px]">
        <Card
          className="bg-yellow"
          radius="md"
        >
          <AttributeCard
            title="Total contributions"
            value={ceremony?.totalContributions?.toString() || ""}
            isLoading={isLoading}
          />
          <AttributeCard
            title="People in the queue"
            value={ceremony?.peopleInQueue?.toString() || ""}
            removeBorderBottom
            isLoading={isLoading}
          />
          <AttributeCard
            title="Avg time to contribute"
            value={ceremony?.avgContributionTime || "-"}
            removeBorderBottom
            isLoading={isLoading}
          />
          <AttributeCard
            title="Penalty"
            value={ceremony?.penalty?.toString() || ""}
            removeBorderBottom
            isLoading={isLoading}
          />
        </Card>
        <Image
          src="/illustrations/attributes.svg"
          alt="Attributes illustration"
          width={240}
          height={70}
        />
      </div>
      <div className="flex flex-col gap-[60px]">
        <div className="flex flex-col col gap-6">
          <div className="flex items-center justify-between">
            {ceremony?.isActive ? (
              <Chip
                withDot
                dotColor="green"
              >
                Open
              </Chip>
            ) : (
              <Chip variant="gray">Closed</Chip>
            )}
            <CeremonyDate
              startDate={ceremony?.startDate}
              endDate={ceremony?.endDate}
            />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-black text-4xl leading-[50px] font-medium">
              {ceremony?.title}
            </h1>
            <div className="flex flex-col">
              {ceremony?.description && (
                <span className="text-black text-base font-normal">
                  {ceremony?.description}
                </span>
              )}
              <div className="border-b border-black my-5"></div>
              <div className="flex flex-col gap-6 ">
                <div className="flex flex-col">
                  <span className="text-black text-base font-normal">
                    Press contribute to join the ceremony
                  </span>
                  <span className="text-gray italic text-sm font-normal">
                    *If contributing on your phone, please do not leave the
                    current browser tab.
                  </span>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="black"
                    className="uppercase"
                  >
                    Contribute on Browser
                  </Button>
                  <Button
                    variant="black"
                    className="uppercase"
                  >
                    Contribute with CLI{" "}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Tabs
          items={[
            {
              id: "live-stats",
              title: "Live Stats",
              content: <LiveStatsSection id={ceremony?.id ?? ""} />,
            },
            {
              id: "contributions",
              title: "Contributions",
              content: <ContributionsSection />,
            },
            {
              id: "about",
              title: "About",
              content: <AboutSection />,
            },
            {
              id: "download-zkey",
              title: "Download ZKey",
              content: <DownloadZkeySection />,
            },
          ]}
        /> */}
      </div>
    </AppContent>
  );
}
