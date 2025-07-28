"use client";

import { classed, VariantProps } from "@tw-classed/react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { X } from "lucide-react";

const ModalComponent = classed.div(
  "fixed inset-0 z-50 bg-black/50",
  "flex items-center justify-center p-4",
  {
    variants: {
      variant: {
        default: "",
        wide: "sm:p-6 md:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const ModalContent = classed.div(
  "relative w-full max-w-lg rounded-[32px] bg-[#FFFDD0] p-6",
  "animate-in fade-in-0 zoom-in-95",
  "font-poppins"
);

const ModalClose = classed.button(
  "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
  "transition-opacity hover:opacity-100",
  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  "disabled:pointer-events-none"
);

const ModalHeader = classed.div(
  "flex flex-col space-y-1.5 text-center sm:text-left"
);

const ModalTitle = classed.h3(
  "text-2xl font-semibold leading-none tracking-tight"
);

const ModalDescription = classed.p(
  "text-base text-black/80"
);

const ModalFooter = classed.div(
  "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
);

const ModalBody = classed.div(
  "relative flex flex-col gap-4 py-4"
);

interface ModalProps extends VariantProps<typeof ModalComponent> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      className,
      variant,
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <ModalComponent
        ref={ref}
        className={cn(className)}
        variant={variant}
        {...props}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <ModalContent
          onClick={(e) => e.stopPropagation()}
          className="relative"
        >
          <ModalClose onClick={onClose}>
            <X className="size-6" />
            <span className="sr-only">Close</span>
          </ModalClose>

          {(title || description) && (
            <ModalHeader>
              {title && <ModalTitle>{title}</ModalTitle>}
              {description && (
                <ModalDescription>{description}</ModalDescription>
              )}
            </ModalHeader>
          )}

          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </ModalComponent>
    );
  }
);

Modal.displayName = "Modal";

export { Modal }; 