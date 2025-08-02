import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ className, children, variant = "default", ...props }, ref) => {
  const baseStyles = "rounded-xl backdrop-blur-sm transition-all duration-200"
  
  const variants = {
    default: "bg-surface/80 shadow-md hover:shadow-lg border border-white/20",
    gradient: "bg-gradient-to-br from-surface/90 to-white/60 shadow-lg hover:shadow-xl border border-white/30",
    glass: "bg-white/40 shadow-lg hover:shadow-xl border border-white/30 backdrop-blur-md",
    elevated: "bg-surface shadow-xl hover:shadow-2xl border border-white/20 hover:scale-[1.01]"
  }
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card