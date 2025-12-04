"use client";

import { AppContent } from "@/app/components/layouts/AppContent";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { CeremonyListItem } from "@/app/components/coordinator/CeremonyListItem";
import Link from "next/link";

// Mock data - In production this would be fetched based on the project ID
const mockProject = {
  id: "1",
  name: "ZK Rollup Project",
  contact: "discord: alice#1234",
  createdDate: "2025-01-15",
};

const mockCeremonies = [
  {
    id: "1",
    name: "ZK Rollup Ceremony #1",
    status: "open" as const,
    participants: 45,
    contributions: 32,
    endDate: "2025-12-30",
  },
  {
    id: "2",
    name: "Privacy Protocol Setup",
    status: "open" as const,
    participants: 28,
    contributions: 20,
    endDate: "2025-11-29",
  },
  {
    id: "3",
    name: "Layer 2 Ceremony",
    status: "closed" as const,
    participants: 120,
    contributions: 118,
    endDate: "2024-11-14",
  },
];

export default function ProjectDetailPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AppContent
      containerClassName="bg-light-base py-[140px] min-h-screen"
      className="flex flex-col gap-10"
    >
      {/* Project Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📦</span>
            <h1 className="text-black text-4xl font-medium">
              {mockProject.name}
            </h1>
          </div>
          <Button
            variant="black"
            className="uppercase"
          >
            + New Ceremony
          </Button>
        </div>

        {/* Project Info */}
        <div className="flex gap-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Contact:</span> {mockProject.contact}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {formatDate(mockProject.createdDate)}
          </div>
        </div>
      </div>

      {/* Ceremonies List */}
      <Card
        className="bg-white"
        radius="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-black text-2xl font-medium">My Ceremonies</h2>
            <span className="text-gray text-sm">
              {mockCeremonies.length} total
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {mockCeremonies.length > 0 ? (
              mockCeremonies.map((ceremony) => (
                <CeremonyListItem
                  key={ceremony.id}
                  ceremony={ceremony}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-600">
                <p className="text-lg">No ceremonies yet</p>
                <p className="text-sm mt-2">
                  Create your first ceremony to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/coordinator">
          <Button
            variant="outline-black"
            size="sm"
          >
            ← Back to Projects
          </Button>
        </Link>
      </div>
    </AppContent>
  );
}
