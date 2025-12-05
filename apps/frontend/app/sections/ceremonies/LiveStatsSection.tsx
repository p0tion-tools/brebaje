import { AttributeCard } from "@/app/components/AttributeCard";
import { Card } from "@/app/components/ui/Card";
import { useGetLiveStatsByCeremonyId } from "@/app/hooks/useGetLiveStatsByCeremonyId";

export const LiveStatsSection = ({ id }: { id: string | number }) => {
  const { data: liveStats = [] } = useGetLiveStatsByCeremonyId(id);

  if (liveStats.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-gray-600">
          <p className="text-lg">No circuits available</p>
          <p className="text-sm mt-2">
            Circuits will appear here once they are uploaded to this ceremony
          </p>
        </div>
      </div>
    );
  }

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
