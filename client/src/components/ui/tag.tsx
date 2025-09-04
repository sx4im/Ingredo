import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const tagVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  removable?: boolean;
  onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, removable = false, onRemove, children, ...props }, ref) => {
    return (
      <div
        className={cn(tagVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="tag-remove"
            aria-label="Remove tag"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);
Tag.displayName = "Tag";

export { Tag, tagVariants };
