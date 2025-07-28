import { cn } from "@/app/lib/utils";
import { classed } from "@tw-classed/react";

const CardBase = classed.div("shadow-border", {
  variants: {
    variant: {
      primary: "bg-yellow-card",
      secondary: "bg-white",
    },
    radius: {
      xxs: "rounded-[10px]",
      xs: "rounded-[20px]",
      sm: "rounded-[25px]",
      md: "rounded-[35px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    radius: "md",
  },
});

const CardTitle = classed.h3("text-black font-normal font-poppins", {
  variants: {
    size: {
      xxs: "text-[16px]",
      sm: "text-[22px]",
      md: "text-[48px] leading-[47px] font-medium",
      lg: "text-[60px] leading-[47px] font-medium",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const CardPadding = classed.div("", {
  variants: {
    size: {
      xxs: "p-[10px]",
      sm: "p-[18px]",
      md: "p-5",
      lg: "p-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface CardProps {
  title?: string;
  titleClassName?: string;
  actions?: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "xxs" | "sm" | "md" | "lg";
  withDivider?: boolean;
  children?: React.ReactNode;
  radius?: "xxs" | "xs" | "sm" | "md";
  className?: string;
}

export const Card = ({
  title,
  titleClassName,
  actions,
  variant = "primary",
  size = "md",
  withDivider = false,
  children,
  radius = "md",
  className,
}: CardProps) => {
  return (
    <CardBase
      variant={variant}
      radius={radius}
      className={className}
    >
      {title && (
        <CardPadding
          className={cn(
            "flex items-center justify-between",
            withDivider && "border-b border-black"
          )}
          size={size}
        >
          <CardTitle size={size} className={titleClassName}>
            {title}
          </CardTitle>
          {actions}
        </CardPadding>
      )}
      <CardPadding size={size}>{children}</CardPadding>
    </CardBase>
  );
};
