"use client";

import { classed, VariantProps } from "@tw-classed/react";
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const InputComponent = classed.input(
  "w-full px-4 py-3 rounded-lg border transition-colors",
  "font-poppins text-base text-black",
  "placeholder:text-gray-400",
  "focus:outline-none focus:ring-2 focus:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus:border-black focus:ring-black",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof InputComponent> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, label, error, helperText, type = "text", ...props },
    ref
  ) => {
    const inputVariant = error ? "error" : variant;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-black">{label}</label>
        )}
        <InputComponent
          type={type}
          className={cn(className)}
          variant={inputVariant}
          ref={ref}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
        {helperText && !error && (
          <span className="text-sm text-gray-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
