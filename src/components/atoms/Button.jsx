import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tap-target"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-primary-500",
    secondary: "bg-gradient-to-r from-secondary-400 to-secondary-300 text-primary-700 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-secondary-400",
    accent: "bg-gradient-to-r from-accent-400 to-accent-300 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-accent-400",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-primary-500",
    ghost: "text-primary-600 hover:bg-primary-50 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-primary-500",
    danger: "bg-gradient-to-r from-red-500 to-red-400 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-red-500"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    xl: "h-14 px-8 text-lg"
  }
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button