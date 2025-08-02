import { useState } from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const TaskCard = ({ task, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(task.duration * 60)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  
  const startTimer = () => {
    setIsActive(true)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }
  
  const handleComplete = () => {
    onComplete(task)
    setIsCompleted(true)
  }
  
  const getCategoryIcon = (category) => {
    const icons = {
      spiritual: "Heart",
      physical: "Activity",
      mental: "Brain",
      social: "Users",
      creative: "Palette"
    }
    return icons[category] || "CheckCircle"
  }
  
  const getCategoryColor = (category) => {
    const colors = {
      spiritual: "text-primary-600",
      physical: "text-secondary-600",
      mental: "text-accent-600",
      social: "text-blue-600",
      creative: "text-purple-600"
    }
    return colors[category] || "text-gray-600"
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={isCompleted ? "opacity-60" : ""}
    >
      <Card variant={isCompleted ? "default" : "elevated"} className="p-4">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon 
                  name={getCategoryIcon(task.category)} 
                  size={16} 
                  className={getCategoryColor(task.category)}
                />
                <Badge variant="secondary" className="text-xs">
                  {task.category}
                </Badge>
                <Badge variant="accent" className="text-xs">
                  {task.points} pts
                </Badge>
              </div>
              
              <h4 className="font-semibold text-gray-900 font-display">
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {task.description}
              </p>
            </div>
            
            {isCompleted && (
              <ApperIcon name="CheckCircle" size={20} className="text-green-500" />
            )}
          </div>
          
          {isActive && (
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 font-display">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">remaining</div>
            </div>
          )}
          
          <div className="flex space-x-2">
            {!isActive && !isCompleted && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={startTimer}
                >
                  <ApperIcon name="Play" size={14} className="mr-1" />
                  Start Timer
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleComplete}
                >
                  <ApperIcon name="Check" size={14} className="mr-1" />
                  Complete
                </Button>
              </>
            )}
            
            {isActive && !isCompleted && (
              <Button
                size="sm"
                className="w-full"
                onClick={handleComplete}
              >
                <ApperIcon name="Check" size={14} className="mr-1" />
                Mark Complete
              </Button>
            )}
            
            {isCompleted && (
              <div className="w-full text-center text-sm text-green-600 font-medium">
                ✨ Well done! +{task.points} points earned
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TaskCard