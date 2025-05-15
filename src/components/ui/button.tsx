
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "btn-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg",
        destructive: "btn-error bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "btn-outline border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "btn-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "btn-ghost hover:bg-accent hover:text-accent-foreground",
        link: "btn-link text-primary underline-offset-4 hover:underline",
        shimmer: "relative inline-flex overflow-hidden bg-primary text-primary-foreground before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:shadow-[0_0_15px_2px_rgba(56,114,224,0.5)]",
        glow: "group relative bg-primary text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_5px_rgba(123,104,238,0.4)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "btn-sm h-9 rounded-md px-3",
        lg: "btn-lg h-11 rounded-md px-8",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
