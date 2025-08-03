"use client";

import { classed, VariantProps } from "@tw-classed/react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Markdown } from "./Markdown";

const AccordionComponent = classed.div(
  "w-full rounded-[10px] bg-white overflow-hidden",
  "transition-all duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "border border-black",
        bordered: "border-2 border-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const AccordionTrigger = classed.button(
  "flex w-full items-center justify-between p-4 text-left",
  "font-poppins text-2xl font-medium",
  "focus:outline-none"
);

const AccordionContent = classed.div(
  "transition-all",
  "font-poppins text-base font-normal text-black",
  "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
);

const AccordionContentInner = classed.div("px-4 pb-4");

interface AccordionItemProps extends VariantProps<typeof AccordionComponent> {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    { title, children, isOpen = false, onToggle, className, variant, ...props },
    ref
  ) => {
    return (
      <AccordionComponent
        ref={ref}
        className={cn(className)}
        variant={variant}
        {...props}
      >
        <AccordionTrigger onClick={onToggle}>
          {title}
          <ChevronDown
            className={cn(
              "h-6 w-6 shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </AccordionTrigger>
        {isOpen && (
          <AccordionContent>
            <AccordionContentInner>{children}</AccordionContentInner>
          </AccordionContent>
        )}
      </AccordionComponent>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
  variant?: VariantProps<typeof AccordionComponent>["variant"];
  className?: string;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, variant, className }, ref) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-4", className)}
      >
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            variant={variant}
          >
            <Markdown>{item.content as string}</Markdown>
          </AccordionItem>
        ))}
      </div>
    );
  }
);

Accordion.displayName = "Accordion";

export { Accordion, AccordionItem };
