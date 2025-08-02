import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StreakCounter = ({ currentStreak, bestStreak, nextMilestone }) => {
  const milestones = [7, 30, 90, 180, 365]
  const nextMilestoneTarget = milestones.find(m => m > currentStreak) || milestones[milestones.length - 1]
  const progress = (currentStreak / nextMilestoneTarget) * 100
  
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <Card variant="gradient" className="p-6 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2C5F2D" />
                <stop offset="100%" stopColor="#97BC62" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-primary-700 font-display">
              {currentStreak}
            </span>
            <span className="text-sm text-primary-600">days clean</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Trophy" size={16} className="text-accent-500" />
            <span className="text-sm text-gray-600">
              Best: {bestStreak} days
            </span>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Target" size={16} className="text-secondary-500" />
            <span className="text-sm text-gray-600">
              Next goal: {nextMilestoneTarget} days
            </span>
          </div>
        </div>
        
        {currentStreak > 0 && currentStreak % 7 === 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <Badge variant="gradient">
              <ApperIcon name="Star" size={12} className="mr-1" />
              Week milestone!
            </Badge>
          </motion.div>
        )}
      </div>
    </Card>
  )
}

export default StreakCounter