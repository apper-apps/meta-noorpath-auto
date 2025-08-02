import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import StreakCounter from "@/components/molecules/StreakCounter"
import MotivationCard from "@/components/molecules/MotivationCard"
import QuickLogButton from "@/components/molecules/QuickLogButton"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { userService } from "@/services/api/userService"
import { urgeLogService } from "@/services/api/urgeLogService"
import { dailyContentService } from "@/services/api/dailyContentService"
import { taskService } from "@/services/api/taskService"
const HomePage = () => {
const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [todayContent, setTodayContent] = useState(null)
  const [urgentTasks, setUrgentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFirstTime, setIsFirstTime] = useState(false)
  useEffect(() => {
    loadHomeData()
  }, [])
  
const loadHomeData = async () => {
    try {
      setError("")
      setLoading(true)
      
      // Check if user exists, if not redirect to onboarding
      const users = await userService.getAll()
      if (users.length === 0) {
        setIsFirstTime(true)
        navigate("/onboarding")
        return
      }
      
      const [user, content, tasks] = await Promise.all([
        userService.getById(1),
        dailyContentService.getTodayContent(),
        taskService.getUrgentTasks(3)
      ])
      
      setUserData(user)
      setTodayContent(content)
      setUrgentTasks(tasks)
    } catch (err) {
      setError("Failed to load home data")
      console.error("Error loading home data:", err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogUrge = async (urgeData) => {
    try {
      await urgeLogService.create({
        userId: 1,
        ...urgeData
      })
      
      // Reset streak if it was a relapse
      if (urgeData.intensity >= 4) {
        await userService.resetStreak(1)
        toast.error("Stay strong. Every setback is a setup for a comeback.")
        loadHomeData()
      } else {
        toast.info("Urge logged. You're doing great by tracking this!")
      }
    } catch (err) {
      toast.error("Failed to log urge")
      console.error("Error logging urge:", err)
    }
  }
  
  const handleRefreshContent = async () => {
    try {
      const newContent = await dailyContentService.getRandomContent()
      setTodayContent(newContent)
      toast.success("New inspiration loaded!")
    } catch (err) {
      toast.error("Failed to refresh content")
    }
  }
  
  const handleCompleteTask = async (task) => {
    try {
      await taskService.completeTask(task.Id)
      await userService.addPoints(1, task.points)
      
      setUrgentTasks(prev => prev.filter(t => t.Id !== task.Id))
      toast.success(`Great job! +${task.points} points earned`)
      
      // Refresh user data to show updated points
      const updatedUser = await userService.getById(1)
      setUserData(updatedUser)
    } catch (err) {
      toast.error("Failed to complete task")
    }
  }
  
  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <Loading type="streak" />
        <Loading type="cards" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Error message={error} onRetry={loadHomeData} />
      </div>
    )
  }
  
if (isFirstTime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-indigo-900/20 min-h-screen">
      {/* Header - NafsVault Branding */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Shield" size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              NafsVault
            </h1>
          </div>
          <p className="text-gray-300">
            May Allah strengthen you today, {userData?.name || 'Brother'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="gradient" className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500">
            <ApperIcon name="Coins" size={14} className="mr-1 text-white" />
            <span className="text-white">{userData?.points || 0}</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-purple-500 text-purple-300">
            L{userData?.level || 1}
          </Badge>
        </div>
      </div>
      
      {/* Black Hole Transformation Visual */}
      <Card variant="glass" className="p-6 bg-gradient-to-br from-gray-900/90 to-purple-900/30 border-purple-500/20">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-900 rounded-full animate-pulse-soft shadow-2xl shadow-purple-500/20"></div>
            <div className="absolute inset-0 w-16 h-16 mx-auto border-2 border-purple-400/30 rounded-full animate-ping"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white font-display">
              Transformation Zone Active
            </h2>
            <p className="text-purple-200 text-sm">
              Your struggles are being transformed into strength
            </p>
          </div>
        </div>
      </Card>
      
      {/* Streak Counter */}
      <StreakCounter
        currentStreak={userData?.currentStreak || 0}
        bestStreak={userData?.bestStreak || 0}
        nextMilestone={30}
      />
      
      {/* Daily Islamic Content */}
      {todayContent && (
        <Card variant="glass" className="p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/20">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="BookOpen" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-300 font-display mb-2">
                Today's Spiritual Guidance
              </h3>
              <p className="text-green-100 leading-relaxed mb-2">
                {todayContent.content}
              </p>
              <p className="text-green-400 text-sm">- {todayContent.source}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshContent}
                className="mt-3 border-green-500 text-green-300 hover:bg-green-500/10"
              >
                <ApperIcon name="RefreshCw" size={14} className="mr-1" />
                New Guidance
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Spiritual Progress Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="glass" className="p-4 text-center bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/20">
          <div className="space-y-2">
            <ApperIcon name="Calendar" size={24} className="text-blue-300 mx-auto" />
            <div className="text-2xl font-bold text-blue-200 font-display">
              {userData?.totalCleanDays || 0}
            </div>
            <div className="text-sm text-blue-300">Days of Purity</div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-4 text-center bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/20">
          <div className="space-y-2">
            <ApperIcon name="Award" size={24} className="text-yellow-300 mx-auto" />
            <div className="text-2xl font-bold text-yellow-200 font-display">
              {userData?.badges?.length || 0}
            </div>
            <div className="text-sm text-yellow-300">Spiritual Badges</div>
          </div>
        </Card>
      </div>
      
      {/* Urgent Spiritual Tasks */}
      {urgentTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white font-display flex items-center">
            <ApperIcon name="Zap" size={20} className="mr-2 text-purple-400" />
            Transform Your Energy
          </h2>
          <div className="space-y-3">
            {urgentTasks.map((task) => (
              <Card key={task.Id} variant="glass" className="p-4 bg-gray-800/50 border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {task.duration} min • {task.points} points • {task.spiritualReward}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  >
                    <ApperIcon name="Play" size={14} className="mr-1" />
                    Transform
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Today's Spiritual Focus */}
      <Card variant="glass" className="p-6 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500/30">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
            <ApperIcon name="Target" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-purple-200 font-display">
            Today's Jihad Against Nafs
          </h3>
          <p className="text-purple-100 leading-relaxed">
            "And whoever strives only strives for [the benefit of] himself. 
            Indeed, Allah is free from need of the worlds."
          </p>
          <p className="text-sm text-purple-300">- Quran 29:6</p>
          <div className="pt-3">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-300 hover:bg-purple-500/10"
              onClick={() => navigate("/progress")}
            >
              <ApperIcon name="TrendingUp" size={14} className="mr-1" />
              Track Progress
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Enhanced Quick Log Button */}
      <QuickLogButton onLog={handleLogUrge} />
      
      {/* Daily Reminder */}
      <Card variant="glass" className="p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/20">
        <div className="flex items-center space-x-3">
          <ApperIcon name="Heart" size={20} className="text-green-400" />
          <div className="flex-1">
            <p className="text-green-200 text-sm">
              Remember: Every moment of resistance strengthens your soul. Allah is with you.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-400 hover:bg-green-500/10"
            onClick={() => toast.success("May Allah grant you strength and peace")}
          >
            <ApperIcon name="Pray" size={16} />
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default HomePage