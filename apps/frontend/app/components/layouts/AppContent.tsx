import { cn } from "@/app/lib/utils";

interface AppContentProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const AppContent = ({
  children,
  className,
  containerClassName,
}: AppContentProps) => {
  return (
    <div className={cn("relative overflow-auto", containerClassName)}>
      <div className={cn("container mx-auto relative")}>
        <div className={cn("px-10", className)}>{children}</div>
      </div>
    </div>
  );
};
