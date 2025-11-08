import { classed, VariantProps } from "@tw-classed/react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { LoaderCircle as Loader } from "lucide-react";
import { Icons } from "../shared/Icons";
import { cn } from "@/lib/utils";

const ButtonComponent = classed.button(
  "duration-200",
  "font-poppins px-5 py-2 rounded-full text-base",
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-6 [&_svg]:h-6 [&_svg]:shrink-0",
  "focus:outline-none focus:ring-0 outline-none focus:ring-offset-0 focus:outline-none",
  {
    variants: {
      variant: {
        yellow:
          "bg-yellow text-black border border-black hover:bg-yellow-hover",
        white: "bg-white text-black border border-black hover:bg-yellow",
        black: "bg-black text-white hover:bg-black/90",
        "outline-white":
          "border border-white text-white hover:text-yellow hover:border-yellow",
        "outline-black": "border border-black text-black",
      },
      fontWeight: {
        bold: "font-bold",
        medium: "font-medium",
        regular: "font-regular",
      },
      size: {
        xs: "py-[6px] px-2",
        sm: "px-[10px] py-2",
        md: "px-5 py-2",
        lg: "px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "yellow",
      fontWeight: "bold",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonComponent> {
  asChild?: boolean;
  icon?: React.ReactNode;
  isExternal?: boolean;
  iconPosition?: "left" | "right";
  className?: string;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      asChild = false,
      icon,
      isExternal = false,
      iconPosition = "left",
      loading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const Icon = icon;

    return (
      <ButtonComponent
        ref={ref}
        {...props}
        className={cn(className)}
        disabled={loading || disabled}
      >
        {iconPosition === "left" && <>{Icon || icon}</>}
        <span>{props.children}</span>
        {iconPosition === "right" && <>{Icon || icon}</>}
        {isExternal && <Icons.External size={18} />}
        {loading && <Loader className="size-4 animate-spin" />}
      </ButtonComponent>
    );
  }
);

Button.displayName = "Button";

export { Button };
