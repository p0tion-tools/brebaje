import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  contact: string;
  ceremoniesCount: number;
  activeCeremoniesCount: number;
  createdDate: string;
}

interface ProjectListItemProps {
  project: Project;
}

export const ProjectListItem = ({ project }: ProjectListItemProps) => {
  const hasActiveCeremonies = project.activeCeremoniesCount > 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:border-gray-400 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <h3 className="text-black text-xl font-medium">{project.name}</h3>
            {hasActiveCeremonies && (
              <Chip
                withDot
                dotColor="green"
              >
                Active
              </Chip>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">{project.ceremoniesCount}</span>
              <span>
                {project.ceremoniesCount === 1 ? "ceremony" : "ceremonies"}
              </span>
            </div>
            {hasActiveCeremonies && (
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {project.activeCeremoniesCount}
                </span>
                <span>active</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>Created:</span>
              <span className="font-medium">
                {formatDate(project.createdDate)}
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">Contact:</span> {project.contact}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/coordinator/projects/${project.id}`}>
            <Button
              variant="outline-black"
              size="sm"
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
