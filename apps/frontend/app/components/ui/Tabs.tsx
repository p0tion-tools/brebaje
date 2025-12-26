"use client";

import { classed, VariantProps } from "@tw-classed/react";
import { cn } from "@/lib/utils";
import {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";

const TabsRoot = classed.div("w-full flex flex-col gap-14", {
  variants: {
    variant: {
      default: "",
      card: "bg-transparent p-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TabsList = classed.div("flex items-center w-full");

const TabsTrigger = classed.button(
  "inline-flex items-center justify-center px-8 py-2 w-full relative border-b-2 border-gray",
  "text-sm font-medium transition-all duration-200 text-gray",
  "data-[state=active]:font-semibold data-[state=active]:border-black data-[state=active]:text-black",
  "outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 ring-0 ring-offset-0"
);

interface TabItem {
  title: string;
  id: string;
  content?: React.ReactNode;
}

interface TabsProps extends VariantProps<typeof TabsRoot> {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const TabsContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    { items, value, defaultValue, onValueChange, className, variant, ...props },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = useState(
      value || defaultValue || (items[0]?.id ?? "")
    );

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setSelectedValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [onValueChange, value]
    );

    return (
      <TabsContext.Provider
        value={{ value: selectedValue, onValueChange: handleValueChange }}
      >
        <TabsRoot
          ref={ref}
          className={cn(className)}
          variant={variant}
          {...props}
        >
          <TabsList>
            {items.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                data-state={selectedValue === item.id ? "active" : "inactive"}
                onClick={() => handleValueChange(item.id)}
              >
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 ring-0 ring-offset-0",
                selectedValue === item.id ? "block" : "hidden"
              )}
            >
              {item.content}
            </div>
          ))}
        </TabsRoot>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

export { Tabs, type TabItem };
