import { useState } from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const MotivationCard = ({ content, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }
  
  return (
    <Card variant="gradient" className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-700 font-display">
            Daily Reflection
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <ApperIcon name="RefreshCw" size={16} />
            </motion.div>
          </Button>
        </div>
        
        <motion.div
          key={content?.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="bg-white/60 rounded-lg p-4 border border-white/30">
            <p className="text-gray-800 leading-relaxed text-center italic">
              "{content?.content}"
            </p>
          </div>
          
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {content?.source}
            </span>
          </div>
        </motion.div>
        
        <div className="flex items-center justify-center space-x-4 pt-2">
          <div className="flex items-center space-x-1 text-secondary-600">
            <ApperIcon name="Heart" size={16} />
            <span className="text-sm">Find peace within</span>
          </div>
          <div className="flex items-center space-x-1 text-primary-600">
            <ApperIcon name="Star" size={16} />
            <span className="text-sm">Stay strong</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MotivationCard