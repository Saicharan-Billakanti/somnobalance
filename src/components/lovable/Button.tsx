import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/lovable-utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lovable-ring disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "bg-lovable-primary text-lovable-primary-foreground hover:bg-lovable-primary/90",
        primary: "bg-lovable-primary text-lovable-primary-foreground hover:bg-lovable-primary/90",
        outline: "border border-lovable-border bg-transparent text-lovable-foreground hover:bg-lovable-muted",
        ghost: "bg-transparent text-lovable-foreground hover:bg-lovable-muted",
        icon: "rounded-full bg-transparent text-lovable-foreground hover:bg-lovable-muted",
        secondary: "bg-lovable-secondary text-lovable-secondary-foreground hover:bg-lovable-secondary/80",
        destructive: "bg-red-600 text-white hover:bg-red-600/90",
        link: "text-lovable-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = "Button";
