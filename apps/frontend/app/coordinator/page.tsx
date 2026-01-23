"use client";

import { AppContent } from "@/app/components/layouts/AppContent";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { StatsCard } from "@/app/components/coordinator/StatsCard";
import { ProjectListItem } from "@/app/components/coordinator/ProjectListItem";
import { ProjectModal } from "@/app/components/coordinator/ProjectModal";
import { useState, useEffect } from "react";
import { useProjects, useCreateProject } from "@/app/hooks/useProjects";
import { ceremoniesApi } from "@/app/lib/api/ceremonies";

export default function CoordinatorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ceremonies, setCeremonies] = useState<any[]>([]);
  const [ceremoniesLoading, setCeremoniesLoading] = useState(true);
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();

  // Fetch all ceremonies
  useEffect(() => {
    const fetchCeremonies = async () => {
      try {
        setCeremoniesLoading(true);
        const data = await ceremoniesApi.findAll();
        setCeremonies(data);
      } catch (error) {
        console.error("Failed to fetch ceremonies:", error);
      } finally {
        setCeremoniesLoading(false);
      }
    };

    fetchCeremonies();
  }, []);

  const handleCreateProject = async (data: {
    name: string;
    contact: string;
  }) => {
    try {
      await createProject.mutateAsync(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      // TODO: Show error notification to user
    }
  };

  // Calculate ceremony counts per project
  const ceremonyCounts = projects.reduce(
    (acc, project) => {
      const projectCeremonies = ceremonies.filter(
        (c) => c.projectId === project.id
      );
      const activeCeremonies = projectCeremonies.filter(
        (c) => c.state === "OPENED" || c.state === "SCHEDULED"
      );

      acc[project.id] = {
        total: projectCeremonies.length,
        active: activeCeremonies.length,
      };
      return acc;
    },
    {} as Record<number, { total: number; active: number }>
  );

  // Transform API data to match component expectations
  const transformedProjects = projects.map((project) => ({
    id: String(project.id),
    name: project.name,
    contact: project.contact,
    ceremoniesCount: ceremonyCounts[project.id]?.total || 0,
    activeCeremoniesCount: ceremonyCounts[project.id]?.active || 0,
    createdAt: project.createdAt,
  }));

  const stats = {
    totalProjects: transformedProjects.length,
    activeProjects: transformedProjects.filter(
      (p) => p.activeCeremoniesCount > 0
    ).length,
    totalCeremonies: ceremonies.length,
  };
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
          onClick={() => setIsModalOpen(true)}
        >
          + New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon="📦"
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon="🟢"
          variant="green"
        />
        <StatsCard
          title="Total Ceremonies"
          value={stats.totalCeremonies}
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
              {transformedProjects.length} total
            </span>
          </div>
          {isLoading ? (
            <div className="text-center py-8 text-gray">
              Loading projects...
            </div>
          ) : transformedProjects.length === 0 ? (
            <div className="text-center py-8 text-gray">
              No projects yet. Create your first project!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {transformedProjects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </AppContent>
  );
}
