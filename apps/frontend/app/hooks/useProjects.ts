import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  projectsApi,
  CreateProjectDto,
  UpdateProjectDto,
  Project,
} from "@/app/lib/api/projects";
import { useAuth } from "@/app/contexts/AuthContext";

export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => projectsApi.findAll(),
  });
};

export const useProject = (id: number) => {
  return useQuery<Project>({
    queryKey: ["projects", id],
    queryFn: () => projectsApi.findOne(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { jwt } = useAuth();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => {
      if (!jwt) {
        throw new Error("Authentication required");
      }
      return projectsApi.create(data, jwt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { jwt } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectDto }) => {
      if (!jwt) {
        throw new Error("Authentication required");
      }
      return projectsApi.update(id, data, jwt);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { jwt } = useAuth();

  return useMutation({
    mutationFn: (id: number) => {
      if (!jwt) {
        throw new Error("Authentication required");
      }
      return projectsApi.delete(id, jwt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
