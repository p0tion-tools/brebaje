import { Card } from "../ui/Card";

interface StatsCardProps {
  title: string;
  value: number;
  icon?: string;
  variant?: "default" | "green" | "gray";
}

const variantStyles = {
  default: "bg-yellow",
  green: "bg-green-100",
  gray: "bg-gray-100",
};

export const StatsCard = ({
  title,
  value,
  icon,
  variant = "default",
}: StatsCardProps) => {
  return (
    <Card
      className={variantStyles[variant]}
      radius="md"
    >
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-gray text-sm font-normal">{title}</span>
          {icon && <span className="text-2xl">{icon}</span>}
        </div>
        <span className="text-black text-4xl font-bold">{value}</span>
      </div>
    </Card>
  );
};
