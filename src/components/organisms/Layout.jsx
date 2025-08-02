import { Outlet } from "react-router-dom"
import BottomNavigation from "@/components/organisms/BottomNavigation"

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-indigo-900/10">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-500/30 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400/25 rounded-full animate-pulse animation-delay-2000"></div>
      </div>
      
      <main className="pb-20 relative">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default Layout