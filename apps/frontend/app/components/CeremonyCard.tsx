import { Icons } from "./shared/Icons";
import { Card } from "./ui/Card";
import { Chip } from "./ui/Chip";
import { CeremonyDate } from "./CeremonyDate";

interface CeremonyCardProps {
  title: string;
  description?: string;
  isActive?: boolean;
  startDate?: string | Date;
  endDate?: string | Date;
}

export const CeremonyCard = ({
  title,
  description,
  isActive,
  startDate,
  endDate,
}: CeremonyCardProps) => {
  return (
    <Card
      variant="secondary"
      radius="xs"
      size="md"
    >
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-[14px] items-start">
          {isActive ? (
            <Chip
              withDot
              dotColor="green"
            >
              Open
            </Chip>
          ) : (
            <Chip variant="gray">Closed</Chip>
          )}
          <span className="text-2xl font-medium text-black">{title}</span>
        </div>
        <div className="flex flex-col gap-[14px]">
          <span className="text-base text-black font-normal line-clamp-2 h-12">
            {description}
          </span>
          <CeremonyDate
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </Card>
  );
};
