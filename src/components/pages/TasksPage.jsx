import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import TaskCard from "@/components/molecules/TaskCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { userService } from "@/services/api/userService"

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const categories = [
    { id: "all", label: "All Tasks", icon: "Grid3X3" },
    { id: "spiritual", label: "Spiritual", icon: "Heart" },
    { id: "physical", label: "Physical", icon: "Activity" },
    { id: "mental", label: "Mental", icon: "Brain" },
    { id: "social", label: "Social", icon: "Users" },
    { id: "creative", label: "Creative", icon: "Palette" }
  ]
  
  useEffect(() => {
    loadTasks()
    loadUserData()
  }, [])
  
  const loadTasks = async () => {
    try {
      setError("")
      setLoading(true)
      
      const allTasks = await taskService.getAll()
      setTasks(allTasks)
    } catch (err) {
      setError("Failed to load tasks")
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }
  
  const loadUserData = async () => {
    try {
      const user = await userService.getById(1)
      setUserPoints(user.points || 0)
    } catch (err) {
      console.error("Error loading user data:", err)
    }
  }
  
  const handleCompleteTask = async (task) => {
    try {
      await taskService.completeTask(task.Id)
      await userService.addPoints(1, task.points)
      
      setCompletedTasks(prev => [...prev, task.Id])
      setUserPoints(prev => prev + task.points)
      
      toast.success(`Excellent! +${task.points} points earned. May Allah reward your efforts.`)
    } catch (err) {
      toast.error("Failed to complete task")
      console.error("Error completing task:", err)
    }
  }
  
  const filteredTasks = selectedCategory === "all" 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory)
  
  const availableTasks = filteredTasks.filter(task => !completedTasks.includes(task.Id))
  
  if (loading) {
    return (
      <div className="p-4">
        <Loading type="cards" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Error message={error} onRetry={loadTasks} />
      </div>
    )
  }
  
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Productive Tasks
          </h1>
          <p className="text-gray-600">
            Transform urges into positive actions
          </p>
        </div>
        
        <Badge variant="gradient" className="px-3 py-2">
          <ApperIcon name="Coins" size={16} className="mr-1" />
          {userPoints}
        </Badge>
      </div>
      
      {/* Daily Progress */}
      <Card variant="gradient" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 font-display">
              Today's Progress
            </h3>
            <p className="text-sm text-gray-600">
              {completedTasks.length} tasks completed
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 font-display">
              {completedTasks.reduce((total, taskId) => {
                const task = tasks.find(t => t.Id === taskId)
                return total + (task?.points || 0)
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Points earned today</div>
          </div>
        </div>
      </Card>
      
      {/* Category Filter */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 font-display">
          Choose Your Focus
        </h2>
        
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="justify-start"
            >
              <ApperIcon name={category.icon} size={16} className="mr-2" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 font-display">
            Available Tasks
          </h2>
          <span className="text-sm text-gray-600">
            {availableTasks.length} task{availableTasks.length !== 1 ? "s" : ""} available
          </span>
        </div>
        
        {availableTasks.length === 0 ? (
          <Empty
            title="All tasks completed!"
            description={
              selectedCategory === "all" 
                ? "Amazing work! You've completed all available tasks for today."
                : `Great job! All ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} tasks are done.`
            }
            icon="Trophy"
            actionLabel="View All Categories"
            onAction={() => setSelectedCategory("all")}
          />
        ) : (
          <div className="space-y-4">
            {availableTasks.map((task) => (
              <TaskCard
                key={task.Id}
                task={task}
                onComplete={handleCompleteTask}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Motivational Footer */}
      <Card variant="glass" className="p-6">
        <div className="text-center space-y-3">
          <ApperIcon name="Sparkles" size={32} className="text-secondary-500 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Every Action Counts
          </h3>
          <p className="text-gray-600">
            "And whoever does an atom's weight of good will see it."
          </p>
          <p className="text-sm text-gray-500">- Quran 99:7</p>
        </div>
      </Card>
    </div>
  )
}

export default TasksPage