interface Activity {
  id: string;
  message: string;
  ceremony: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="flex flex-col gap-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-black text-base font-normal">
              {activity.message}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{activity.ceremony}</span>
              <span>•</span>
              <span>{activity.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">No recent activity</div>
      )}
    </div>
  );
};
