"use client";

import { AppContent } from "@/app/components/layouts/AppContent";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { StatsCard } from "@/app/components/coordinator/StatsCard";
import { ProjectListItem } from "@/app/components/coordinator/ProjectListItem";
import { ActivityFeed } from "@/app/components/coordinator/ActivityFeed";

// Mock data
const mockStats = {
  totalProjects: 3,
  activeProjects: 2,
  totalCeremonies: 12,
};

const mockProjects = [
  {
    id: "1",
    name: "ZK Rollup Project",
    contact: "discord: alice#1234",
    ceremoniesCount: 5,
    activeCeremoniesCount: 2,
    createdDate: "2025-01-15",
  },
  {
    id: "2",
    name: "Privacy Protocol",
    contact: "telegram: @bobzkp",
    ceremoniesCount: 4,
    activeCeremoniesCount: 1,
    createdDate: "2024-11-20",
  },
  {
    id: "3",
    name: "Layer 2 Solutions",
    contact: "email: contact@layer2.io",
    ceremoniesCount: 3,
    activeCeremoniesCount: 0,
    createdDate: "2024-10-05",
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
          + New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <StatsCard
          title="Total Projects"
          value={mockStats.totalProjects}
          icon="📦"
        />
        <StatsCard
          title="Active Projects"
          value={mockStats.activeProjects}
          icon="🟢"
          variant="green"
        />
        <StatsCard
          title="Total Ceremonies"
          value={mockStats.totalCeremonies}
          icon="📊"
          variant="gray"
        />
      </div>

      {/* Projects List */}
      <Card
        className="bg-white"
        radius="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-black text-2xl font-medium">My Projects</h2>
            <span className="text-gray text-sm">
              {mockProjects.length} total
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {mockProjects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
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
