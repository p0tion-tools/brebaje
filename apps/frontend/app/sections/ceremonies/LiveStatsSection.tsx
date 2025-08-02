import { AttributeCard } from "@/app/components/AttributeCard";
import { Card } from "@/app/components/ui/Card";
import { useGetLiveStatsByCeremonyId } from "@/app/hooks/useGetLiveStatsByCeremonyId";

export const LiveStatsSection = ({ id }: { id: string | number }) => {
  const { data: liveStats = [], isLoading } = useGetLiveStatsByCeremonyId(id);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {liveStats.map((stat) => (
        <Card
          key={stat.title}
          title={stat.title}
          size="sm"
          titleClassName="!font-medium"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 -mt-[18px]">
            <AttributeCard
              removeBorderLeft
              size="sm"
              title="Completed"
              value={stat.completed.toString()}
            />
            <AttributeCard
              removeBorderLeft
              size="sm"
              title="Memory Required"
              value={`${stat.memoryRequired.toString()} mb`}
            />
            <AttributeCard
              removeBorderBottom
              size="sm"
              title="Avg Contribution Time"
              value={`${stat.avgContributionTime.toString()}s`}
            />
            <AttributeCard
              removeBorderBottom
              removeBorderLeft
              size="sm"
              title="Max Contribution Time"
              value={`${stat.maxContributionTime.toString()}s`}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};
