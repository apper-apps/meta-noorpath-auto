import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const BottomNavigation = () => {
  const location = useLocation()
  
  const navItems = [
    { path: "/", label: "Home", icon: "Home" },
    { path: "/track", label: "Track", icon: "Target" },
    { path: "/tasks", label: "Tasks", icon: "CheckSquare" },
    { path: "/partners", label: "Partners", icon: "Users" },
    { path: "/progress", label: "Progress", icon: "TrendingUp" }
  ]
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center p-2 min-w-[60px] tap-target"
              >
                {({ isActive: linkActive }) => (
                  <>
                    {linkActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-100 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    <div className="relative z-10 flex flex-col items-center space-y-1">
                      <ApperIcon
                        name={item.icon}
                        size={20}
                        className={`transition-colors duration-200 ${
                          linkActive ? "text-primary-600" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium transition-colors duration-200 ${
                          linkActive ? "text-primary-600" : "text-gray-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BottomNavigation