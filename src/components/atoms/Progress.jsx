import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Progress = forwardRef(({ className, value = 0, max = 100, variant = "default", ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const baseStyles = "relative h-2 w-full overflow-hidden rounded-full"
  
  const variants = {
    default: "bg-gray-200",
    primary: "bg-primary-100",
    secondary: "bg-secondary-100",
    accent: "bg-accent-100"
  }
  
  const fillVariants = {
    default: "bg-gray-600",
    primary: "bg-gradient-to-r from-primary-600 to-primary-500",
    secondary: "bg-gradient-to-r from-secondary-400 to-secondary-300",
    accent: "bg-gradient-to-r from-accent-400 to-accent-300"
  }
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-500 ease-out", fillVariants[variant])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
})

Progress.displayName = "Progress"

export default Progress