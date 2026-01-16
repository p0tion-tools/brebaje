"use client";

import { AppContent } from "@/app/components/layouts/AppContent";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Chip } from "@/app/components/ui/Chip";
import { ceremoniesApi, type Ceremony } from "@/app/lib/api/ceremonies";
import { projectsApi, type Project } from "@/app/lib/api/projects";
import { participantsApi, type Participant } from "@/app/lib/api/participants";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function CeremonyDetailPage() {
  const params = useParams();
  const ceremonyId = Number(params.id);
  const { user, jwt, isLoggedIn } = useAuth();

  const [ceremony, setCeremony] = useState<Ceremony | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  // Mock circuits data for now - would be fetched from circuits API
  const mockCircuits = [
    {
      id: "1",
      name: "Transaction Circuit",
      constraints: 2097152,
      completedContributions: 25,
      failedContributions: 2,
      sequencePosition: 1,
    },
    {
      id: "2",
      name: "Merkle Tree Circuit",
      constraints: 1048576,
      completedContributions: 32,
      failedContributions: 1,
      sequencePosition: 2,
    },
  ];

  // Fetch ceremony and project data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching ceremony with ID:", ceremonyId);

        // Fetch ceremony details
        const ceremonyData = await ceremoniesApi.findOne(ceremonyId);
        console.log("Ceremony data received:", ceremonyData);
        setCeremony(ceremonyData);

        // Fetch related project details
        const projectData = await projectsApi.findOne(ceremonyData.projectId);
        console.log("Project data received:", projectData);
        setProject(projectData);

        // Fetch participants
        try {
          const participantsData =
            await participantsApi.findByCeremony(ceremonyId);
          console.log("Participants data received:", participantsData);
          setParticipants(participantsData);
        } catch (err) {
          console.error("Failed to fetch participants:", err);
          // Don't fail the whole page if participants fail to load
        }
      } catch (err) {
        console.error("Detailed error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch ceremony data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (ceremonyId && !isNaN(ceremonyId)) {
      fetchData();
    } else {
      setError("Invalid ceremony ID");
      setLoading(false);
    }
  }, [ceremonyId]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDisplayStatus = (state: string) => {
    switch (state?.toUpperCase()) {
      case "OPENED":
        return { status: "open", label: "Open", color: "green" };
      case "CLOSED":
      case "FINALIZED":
      case "CANCELED":
        return { status: "closed", label: "Closed", color: "gray" };
      case "SCHEDULED":
      case "PAUSED":
      default:
        return { status: "scheduled", label: "Scheduled", color: "yellow" };
    }
  };

  const handleJoinCeremony = async () => {
    if (!isLoggedIn || !jwt) {
      alert("Please log in to join this ceremony");
      return;
    }

    try {
      setJoining(true);
      const result = await ceremoniesApi.joinCeremony(ceremonyId, jwt);
      alert(result.message || "Successfully joined ceremony!");

      // Refresh participants list
      const participantsData = await participantsApi.findByCeremony(ceremonyId);
      setParticipants(participantsData);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to join ceremony");
      console.error("Join ceremony error:", err);
    } finally {
      setJoining(false);
    }
  };

  const handleCopyLink = () => {
    const ceremonyUrl = `${window.location.origin}/ceremonies/${ceremonyId}`;
    navigator.clipboard.writeText(ceremonyUrl);
    alert("Ceremony link copied to clipboard!");
  };

  if (loading) {
    return (
      <AppContent
        containerClassName="bg-light-base py-[140px] min-h-screen"
        className="flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading ceremony...</div>
        </div>
      </AppContent>
    );
  }

  if (error || !ceremony || !project) {
    return (
      <AppContent
        containerClassName="bg-light-base py-[140px] min-h-screen"
        className="flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">
            {error || "Ceremony not found"}
          </div>
          <Link href="/coordinator">
            <Button variant="outline-black">← Back to Projects</Button>
          </Link>
        </div>
      </AppContent>
    );
  }

  const displayStatus = getDisplayStatus(ceremony.state);
  const isOpen = displayStatus.status === "open";

  console.log("Debug - ceremony.state:", ceremony.state);
  console.log("Debug - displayStatus:", displayStatus);
  console.log("Debug - isOpen:", isOpen);

  return (
    <AppContent
      containerClassName="bg-light-base py-[140px] min-h-screen"
      className="flex flex-col gap-10"
    >
      {/* Ceremony Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📋</span>
            <div className="flex flex-col gap-2">
              <h1 className="text-black text-4xl font-medium">
                {ceremony.description}
              </h1>
              <p className="text-gray-600 text-lg">Type: {ceremony.type}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isOpen ? (
              <>
                <Button
                  variant="outline-black"
                  className="uppercase"
                  onClick={handleCopyLink}
                >
                  📋 Copy Link
                </Button>
                <Button
                  variant="outline-black"
                  className="uppercase"
                  onClick={handleJoinCeremony}
                  disabled={!isLoggedIn || joining}
                >
                  {joining ? "Joining..." : "Join Ceremony"}
                </Button>
                <Button
                  variant="black"
                  className="uppercase"
                >
                  Finalize
                </Button>
              </>
            ) : (
              <Button
                variant="outline-black"
                className="uppercase"
              >
                Download Results
              </Button>
            )}
          </div>
        </div>

        {/* Ceremony Info */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Status:</span>
            {displayStatus.status === "open" ? (
              <Chip
                withDot
                dotColor="green"
              >
                {displayStatus.label}
              </Chip>
            ) : displayStatus.status === "closed" ? (
              <Chip variant="gray">{displayStatus.label}</Chip>
            ) : (
              <Chip variant="yellow">{displayStatus.label}</Chip>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Type:</span>
            <Chip variant="yellow">{ceremony.type}</Chip>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Start:</span>{" "}
            {formatDate(ceremony.start_date)}
          </div>
          <div className="text-gray-600">
            <span className="font-medium">End:</span>{" "}
            {formatDate(ceremony.end_date)}
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Penalty:</span> {ceremony.penalty}s
          </div>
        </div>

        {/* Project Link */}
        <div className="text-sm">
          <span className="text-gray-600">Project:</span>{" "}
          <Link
            href={`/coordinator/projects/${project.id}`}
            className="text-black hover:underline font-medium"
          >
            {project.name}
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="bg-white"
          radius="md"
        >
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-black mb-2">
              {participants.length}
            </div>
            <div className="text-gray-600">Total Participants</div>
          </div>
        </Card>
        <Card
          className="bg-white"
          radius="md"
        >
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="text-gray-600">Completed Contributions</div>
          </div>
        </Card>
        <Card
          className="bg-white"
          radius="md"
        >
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mockCircuits.length}
            </div>
            <div className="text-gray-600">Circuits</div>
          </div>
        </Card>
      </div>

      {/* Circuits List */}
      <Card
        className="bg-white"
        radius="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-black text-2xl font-medium">Circuits</h2>
          </div>
          <div className="flex flex-col gap-4">
            {mockCircuits.map((circuit) => (
              <div
                key={circuit.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">⚡</span>
                      <h3 className="text-black text-lg font-medium">
                        {circuit.name}
                      </h3>
                      <Chip variant="gray">
                        Position {circuit.sequencePosition}
                      </Chip>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Constraints:</span>{" "}
                        {circuit.constraints.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Completed:</span>{" "}
                        {circuit.completedContributions}
                      </div>
                      <div>
                        <span className="font-medium">Failed:</span>{" "}
                        {circuit.failedContributions}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline-black"
                      size="sm"
                    >
                      View Details
                    </Button>
                    {isOpen && (
                      <Button
                        variant="black"
                        size="sm"
                      >
                        Contribute
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Participants List */}
      <Card
        className="bg-white"
        radius="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-black text-2xl font-medium">Participants</h2>
            <Chip variant="gray">{participants.length} Total</Chip>
          </div>
          <div className="flex flex-col gap-3">
            {participants.length === 0 ? (
              <div className="text-gray-600 text-center py-8">
                No participants yet. Share the ceremony link to invite people!
              </div>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {participant.user?.avatarUrl && (
                      <img
                        src={participant.user.avatarUrl}
                        alt={
                          participant.user.displayName ||
                          participant.user.walletAddress
                        }
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="text-black font-medium">
                        {participant.user?.displayName ||
                          participant.user?.walletAddress ||
                          "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {participant.user?.provider
                          ? participant.user.provider.toUpperCase()
                          : "Unknown Provider"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {participant.status === "DONE" ? (
                      <Chip
                        variant="gray"
                        withDot
                        dotColor="green"
                      >
                        {participant.status}
                      </Chip>
                    ) : participant.status === "CONTRIBUTING" ? (
                      <Chip variant="yellow">{participant.status}</Chip>
                    ) : (
                      <Chip variant="gray">{participant.status}</Chip>
                    )}
                    <div className="text-sm text-gray-600">
                      Progress: {participant.contributionProgress || 0}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href={`/coordinator/projects/${project.id}`}>
          <Button
            variant="outline-black"
            size="sm"
          >
            ← Back to Project
          </Button>
        </Link>
      </div>
    </AppContent>
  );
}
