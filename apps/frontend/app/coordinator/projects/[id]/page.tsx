"use client";

import { AppContent } from "@/app/components/layouts/AppContent";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { CeremonyListItem } from "@/app/components/coordinator/CeremonyListItem";
import { CeremonyModal } from "@/app/components/coordinator/CeremonyModal";
import {
  ceremoniesApi,
  formatCeremonyForDisplay,
  type Ceremony,
} from "@/app/lib/api/ceremonies";
import { projectsApi, type Project } from "@/app/lib/api/projects";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = Number(params.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ceremonies, setCeremonies] = useState<any[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project and ceremonies on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch project details and ceremonies in parallel
        const [projectData, ceremoniesData] = await Promise.all([
          projectsApi.findOne(projectId),
          ceremoniesApi.findByProject(projectId),
        ]);

        setProject(projectData);
        setCeremonies(ceremoniesData.map(formatCeremonyForDisplay));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateCeremony = async (data: {
    description: string;
    type: "PHASE1" | "PHASE2";
    start_date: string;
    end_date: string;
    penalty: number;
  }) => {
    try {
      // Get auth token (you'll need to implement auth context)
      const token = localStorage.getItem("authToken") || ""; // Temporary solution

      const newCeremony = await ceremoniesApi.create(
        {
          projectId,
          ...data,
        },
        token
      );

      // Add the new ceremony to the list
      setCeremonies((prev) => [...prev, formatCeremonyForDisplay(newCeremony)]);
      setIsModalOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create ceremony"
      );
      console.error("Error creating ceremony:", err);
    }
  };

  if (loading) {
    return (
      <AppContent
        containerClassName="bg-light-base py-[140px] min-h-screen"
        className="flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading project...</div>
        </div>
      </AppContent>
    );
  }

  if (error || !project) {
    return (
      <AppContent
        containerClassName="bg-light-base py-[140px] min-h-screen"
        className="flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">
            {error || "Project not found"}
          </div>
          <Link href="/coordinator">
            <Button variant="outline-black">← Back to Projects</Button>
          </Link>
        </div>
      </AppContent>
    );
  }

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
            <h1 className="text-black text-4xl font-medium">{project.name}</h1>
          </div>
          <Button
            variant="black"
            className="uppercase"
            onClick={() => setIsModalOpen(true)}
          >
            + New Ceremony
          </Button>
        </div>

        {/* Project Info */}
        <div className="flex gap-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Contact:</span> {project.contact}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {formatDate(project.createdAt)}
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
            <span className="text-gray text-sm">{ceremonies.length} total</span>
          </div>
          <div className="flex flex-col gap-4">
            {ceremonies.length > 0 ? (
              ceremonies.map((ceremony) => (
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

      {/* Ceremony Modal */}
      <CeremonyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCeremony}
      />
    </AppContent>
  );
}
