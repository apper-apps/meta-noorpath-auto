import { useState, useEffect } from "react"
import { toast } from "react-toastify"
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
  const [userData, setUserData] = useState(null)
  const [todayContent, setTodayContent] = useState(null)
  const [urgentTasks, setUrgentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    loadHomeData()
  }, [])
  
  const loadHomeData = async () => {
    try {
      setError("")
      setLoading(true)
      
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
  
  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Assalamu Alaikum
          </h1>
          <p className="text-gray-600">
            May Allah strengthen you today
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="gradient" className="px-3 py-1">
            <ApperIcon name="Coins" size={14} className="mr-1" />
            {userData?.points || 0}
          </Badge>
        </div>
      </div>
      
      {/* Streak Counter */}
      <StreakCounter
        currentStreak={userData?.currentStreak || 0}
        bestStreak={userData?.bestStreak || 0}
        nextMilestone={30}
      />
      
      {/* Daily Motivation */}
      {todayContent && (
        <MotivationCard
          content={todayContent}
          onRefresh={handleRefreshContent}
        />
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="gradient" className="p-4 text-center">
          <div className="space-y-2">
            <ApperIcon name="Calendar" size={24} className="text-primary-600 mx-auto" />
            <div className="text-2xl font-bold text-primary-700 font-display">
              {userData?.totalCleanDays || 0}
            </div>
            <div className="text-sm text-gray-600">Total Clean Days</div>
          </div>
        </Card>
        
        <Card variant="gradient" className="p-4 text-center">
          <div className="space-y-2">
            <ApperIcon name="Award" size={24} className="text-secondary-600 mx-auto" />
            <div className="text-2xl font-bold text-secondary-700 font-display">
              {userData?.badges?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
        </Card>
      </div>
      
      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 font-display">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {urgentTasks.map((task) => (
              <Card key={task.Id} variant="default" className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {task.duration} min • {task.points} points
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task)}
                  >
                    <ApperIcon name="Play" size={14} className="mr-1" />
                    Start
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Today's Focus */}
      <Card variant="glass" className="p-6">
        <div className="text-center space-y-3">
          <ApperIcon name="Target" size={32} className="text-accent-500 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Today's Focus
          </h3>
          <p className="text-gray-600">
            "And whoever relies upon Allah - then He is sufficient for him. 
            Indeed, Allah will accomplish His purpose."
          </p>
          <p className="text-sm text-gray-500">- Quran 65:3</p>
        </div>
      </Card>
      
      {/* Quick Log Button */}
      <QuickLogButton onLog={handleLogUrge} />
    </div>
  )
}

export default HomePage