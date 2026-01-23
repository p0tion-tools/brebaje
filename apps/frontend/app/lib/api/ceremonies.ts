const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8067";

export interface Ceremony {
  id: number;
  projectId: number;
  description: string;
  type: "PHASE1" | "PHASE2";
  state:
    | "SCHEDULED"
    | "OPENED"
    | "PAUSED"
    | "CLOSED"
    | "CANCELED"
    | "FINALIZED";
  start_date: number;
  end_date: number;
  penalty: number;
  authProviders: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCeremonyDto {
  projectId: number;
  description: string;
  type: "PHASE1" | "PHASE2";
  start_date: string; // ISO string from datetime-local input
  end_date: string; // ISO string from datetime-local input
  penalty: number;
  authProviders?: any[];
}

export interface UpdateCeremonyDto {
  description?: string;
  type?: "PHASE1" | "PHASE2";
  state?:
    | "SCHEDULED"
    | "OPENED"
    | "PAUSED"
    | "CLOSED"
    | "CANCELED"
    | "FINALIZED";
  start_date?: string;
  end_date?: string;
  penalty?: number;
  authProviders?: any[];
}

export const ceremoniesApi = {
  async create(data: CreateCeremonyDto, token: string): Promise<Ceremony> {
    // Convert datetime-local strings to Unix timestamps
    const ceremonyData = {
      ...data,
      start_date: Math.floor(new Date(data.start_date).getTime() / 1000),
      end_date: Math.floor(new Date(data.end_date).getTime() / 1000),
      authProviders: data.authProviders || ["github"],
    };

    const response = await fetch(`${API_URL}/ceremonies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ceremonyData),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to create ceremony" }));
      throw new Error(error.message || "Failed to create ceremony");
    }

    return response.json();
  },

  async findAll(): Promise<Ceremony[]> {
    const response = await fetch(`${API_URL}/ceremonies`);

    if (!response.ok) {
      throw new Error("Failed to fetch ceremonies");
    }

    return response.json();
  },

  async findByProject(projectId: number): Promise<Ceremony[]> {
    const response = await fetch(
      `${API_URL}/ceremonies?projectId=${projectId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch project ceremonies");
    }

    return response.json();
  },

  async findOne(id: number): Promise<Ceremony> {
    const response = await fetch(`${API_URL}/ceremonies/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch ceremony");
    }

    return response.json();
  },

  async update(
    id: number,
    data: UpdateCeremonyDto,
    token: string
  ): Promise<Ceremony> {
    // Convert datetime-local strings to Unix timestamps if provided
    const ceremonyData = { ...data };
    if (data.start_date) {
      ceremonyData.start_date = Math.floor(
        new Date(data.start_date).getTime() / 1000
      ) as any;
    }
    if (data.end_date) {
      ceremonyData.end_date = Math.floor(
        new Date(data.end_date).getTime() / 1000
      ) as any;
    }

    const response = await fetch(`${API_URL}/ceremonies/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ceremonyData),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to update ceremony" }));
      throw new Error(error.message || "Failed to update ceremony");
    }

    return response.json();
  },

  async delete(id: number, token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/ceremonies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to delete ceremony" }));
      throw new Error(error.message || "Failed to delete ceremony");
    }

    return response.json();
  },

  async joinCeremony(
    ceremonyId: number,
    token: string
  ): Promise<{ message: string; participant: any }> {
    const response = await fetch(`${API_URL}/ceremonies/${ceremonyId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to join ceremony" }));
      throw new Error(error.message || "Failed to join ceremony");
    }

    return response.json();
  },

  async getCeremonyParticipants(ceremonyId: number): Promise<any[]> {
    const response = await fetch(
      `${API_URL}/ceremonies/${ceremonyId}/participants`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ceremony participants");
    }

    return response.json();
  },

  async createWithCircuit(
    data: CreateCeremonyDto & { circuitFile: File | null },
    token: string
  ): Promise<Ceremony> {
    // First create the ceremony
    const ceremony = await this.create(data, token);

    // If there's a circuit file, upload it
    if (data.circuitFile) {
      try {
        const formData = new FormData();
        formData.append("file", data.circuitFile);
        formData.append("ceremonyId", ceremony.id.toString());
        formData.append("name", data.circuitFile.name);
        formData.append("sequencePosition", "1");

        const uploadResponse = await fetch(`${API_URL}/circuits/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          console.error(
            "Failed to upload circuit file, but ceremony was created"
          );
        }
      } catch (error) {
        console.error("Error uploading circuit file:", error);
      }
    }

    return ceremony;
  },
};

// Helper functions to format ceremony data for display
export const formatCeremonyForDisplay = (ceremony: Ceremony) => {
  // Map ceremony state to display status
  const getDisplayStatus = (state: string): "open" | "closed" | "scheduled" => {
    switch (state.toUpperCase()) {
      case "OPENED":
        return "open";
      case "CLOSED":
      case "FINALIZED":
      case "CANCELED":
        return "closed";
      case "SCHEDULED":
      case "PAUSED":
      default:
        return "scheduled";
    }
  };

  return {
    id: ceremony.id.toString(),
    name: ceremony.description,
    status: getDisplayStatus(ceremony.state),
    participants: 0, // This will be populated from participants API
    endDate: new Date(ceremony.end_date * 1000).toISOString().split("T")[0],
    startDate: new Date(ceremony.start_date * 1000).toISOString().split("T")[0],
    type: ceremony.type,
    penalty: ceremony.penalty,
  };
};
