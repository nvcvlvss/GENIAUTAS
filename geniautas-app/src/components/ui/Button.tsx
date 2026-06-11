import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-[#0F172A] hover:bg-primary/90",
        primary: "bg-primary text-[#0F172A] hover:bg-primary/90",
        outline:
          "border-border bg-transparent text-[#38BDF8] hover:bg-[#38BDF8]/10 aria-expanded:bg-[#38BDF8]/10 aria-expanded:text-[#38BDF8]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        warning:
          "bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        md: "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xl: "h-12 gap-2 px-6 text-base",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      fullWidth: {
        true: "w-full",
      },
      iconOnly: {
        true: "px-0 aspect-square justify-center",
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
  loading?: boolean
  href?: string
  asChild?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  fullWidth,
  iconOnly,
  loading = false,
  children,
  href,
  disabled,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : (href ? "a" : ButtonPrimitive)
  
  const content = (
    <>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </>
  )

  const classes = cn(buttonVariants({ variant, size, fullWidth, iconOnly, className }))

  if (asChild) {
    return (
      <Slot className={classes}>
        {children}
      </Slot>
    )
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...(props as any)}>
        {content}
      </Link>
    )
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={classes}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {content}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
