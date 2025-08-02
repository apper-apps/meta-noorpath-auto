import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by taking your first action",
  actionLabel = "Get Started",
  onAction,
  icon = "Smile"
}) => {
  return (
    <Card variant="default" className="p-8 text-center">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} size={32} className="text-gray-400" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            {title}
          </h3>
          <p className="text-gray-600 mt-1">
            {description}
          </p>
        </div>
        
        {onAction && (
          <Button onClick={onAction} className="mx-auto">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
        
        <div className="text-sm text-gray-500">
          Every journey begins with a single step. You can do this! 🌟
        </div>
      </div>
    </Card>
  )
}

export default Empty