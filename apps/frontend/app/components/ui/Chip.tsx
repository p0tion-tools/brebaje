import { classed, VariantProps } from "@tw-classed/react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const ChipComponent = classed.div(
  "inline-flex items-center gap-1 px-6 py-1.5 rounded-full font-poppins",
  "text-base font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        yellow: "bg-yellow text-black border border-black",
        gray: "bg-white text-chip-disabled border border-chip-disabled",
      },
      state: {
        active: "",
        inactive: "opacity-60",
      },
      size: {
        sm: "text-xs px-6 py-[6px]",
        md: "text-base px-6 py-2",
      },
    },
    defaultVariants: {
      variant: "yellow",
      state: "active",
      size: "sm",
    },
  }
);

const StatusDot = classed.div(
  "size-2 rounded-full",
  {
    variants: {
      color: {
        green: "bg-green-500 animate-pulse",
        red: "bg-red-500",
        yellow: "bg-yellow-500",
        gray: "bg-gray-500",
      },
    },
    defaultVariants: {
      color: "green",
    },
  }
);

interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ChipComponent> {
  withDot?: boolean;
  dotColor?: "green" | "red" | "yellow" | "gray";
  className?: string;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      children,
      variant,
      state,
      size,
      withDot = false,
      dotColor = "green",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <ChipComponent
        ref={ref}
        variant={variant}
        state={state}
        size={size}
        className={cn(className)}
        {...props}
      >
        {withDot && <StatusDot color={dotColor} />}
        {children}
      </ChipComponent>
    );
  }
);

Chip.displayName = "Chip";

export { Chip }; 