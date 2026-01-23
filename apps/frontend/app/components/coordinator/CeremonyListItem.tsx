import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import Link from "next/link";

interface Ceremony {
  id: string;
  name: string;
  status: "open" | "closed" | "scheduled";
  participants: number;
  endDate: string;
}

interface CeremonyListItemProps {
  ceremony: Ceremony;
}

export const CeremonyListItem = ({ ceremony }: CeremonyListItemProps) => {
  const isOpen = ceremony.status === "open";

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
            <span className="text-2xl">📋</span>
            <h3 className="text-black text-xl font-medium">{ceremony.name}</h3>
            {ceremony.status === "open" ? (
              <Chip
                withDot
                dotColor="green"
              >
                Open
              </Chip>
            ) : ceremony.status === "closed" ? (
              <Chip variant="gray">Closed</Chip>
            ) : (
              <Chip variant="yellow">Scheduled</Chip>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">{ceremony.participants}</span>
              <span>participants</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Ends:</span>
              <span className="font-medium">
                {formatDate(ceremony.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/coordinator/ceremonies/${ceremony.id}`}>
            <Button
              variant="outline-black"
              size="sm"
            >
              View
            </Button>
          </Link>
          {isOpen ? (
            <Button
              variant="black"
              size="sm"
            >
              Finalize
            </Button>
          ) : (
            <Button
              variant="outline-black"
              size="sm"
            >
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
