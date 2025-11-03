"use client";

import { AppContent } from "@/app/components/layouts/AppContent";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { StatsCard } from "@/app/components/coordinator/StatsCard";
import { CeremonyListItem } from "@/app/components/coordinator/CeremonyListItem";
import { ActivityFeed } from "@/app/components/coordinator/ActivityFeed";

// Mock data
const mockStats = {
  totalCeremonies: 12,
  activeCeremonies: 3,
  completedCeremonies: 9,
};

const mockCeremonies = [
  {
    id: "1",
    name: "ZK Rollup Ceremony #1",
    status: "open" as const,
    participants: 45,
    contributions: 32,
    endDate: "2025-12-31",
  },
  {
    id: "2",
    name: "Privacy Protocol Setup",
    status: "open" as const,
    participants: 28,
    contributions: 20,
    endDate: "2025-11-30",
  },
  {
    id: "3",
    name: "Layer 2 Ceremony",
    status: "closed" as const,
    participants: 120,
    contributions: 118,
    endDate: "2024-11-15",
  },
];

const mockActivities = [
  {
    id: "1",
    message: "User alice_zkp completed contribution",
    ceremony: "ZK Rollup Ceremony #1",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    message: "Layer 2 Ceremony finalized successfully",
    ceremony: "Layer 2 Ceremony",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    message: "15 new participants joined",
    ceremony: "Privacy Protocol Setup",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    message: "User bob_contributor completed contribution",
    ceremony: "ZK Rollup Ceremony #1",
    timestamp: "2 days ago",
  },
];

export default function CoordinatorDashboard() {
  return (
    <AppContent
      containerClassName="bg-light-base py-[140px] min-h-screen"
      className="flex flex-col gap-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-black text-4xl font-medium">
          Coordinator Dashboard
        </h1>
        <Button
          variant="black"
          className="uppercase"
        >
          + New Ceremony
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <StatsCard
          title="Total Ceremonies"
          value={mockStats.totalCeremonies}
          icon="📊"
        />
        <StatsCard
          title="Active Ceremonies"
          value={mockStats.activeCeremonies}
          icon="🟢"
          variant="green"
        />
        <StatsCard
          title="Completed Ceremonies"
          value={mockStats.completedCeremonies}
          icon="✅"
          variant="gray"
        />
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
            {mockCeremonies.map((ceremony) => (
              <CeremonyListItem
                key={ceremony.id}
                ceremony={ceremony}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card
        className="bg-white"
        radius="md"
      >
        <div className="p-6">
          <h2 className="text-black text-2xl font-medium mb-6">
            Recent Activity
          </h2>
          <ActivityFeed activities={mockActivities} />
        </div>
      </Card>
    </AppContent>
  );
}
