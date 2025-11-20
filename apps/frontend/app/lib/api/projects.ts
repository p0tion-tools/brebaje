const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8067";

export interface Project {
  id: number;
  name: string;
  contact: string;
  coordinatorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  contact: string;
}

export interface UpdateProjectDto {
  name?: string;
  contact?: string;
}

export const projectsApi = {
  async create(data: CreateProjectDto, token: string): Promise<Project> {
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to create project" }));
      throw new Error(error.message || "Failed to create project");
    }

    return response.json();
  },

  async findAll(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects`);

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    return response.json();
  },

  async findOne(id: number): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }

    return response.json();
  },

  async update(
    id: number,
    data: UpdateProjectDto,
    token: string
  ): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to update project" }));
      throw new Error(error.message || "Failed to update project");
    }

    return response.json();
  },

  async delete(id: number, token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to delete project" }));
      throw new Error(error.message || "Failed to delete project");
    }

    return response.json();
  },
};
