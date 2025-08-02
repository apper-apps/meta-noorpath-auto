import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card variant="default" className="p-8 text-center">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mt-1">
            {message}
          </p>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry} className="mx-auto">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
        
        <div className="text-sm text-gray-500">
          If this problem persists, please take a moment for dhikr and try again later.
        </div>
      </div>
    </Card>
  )
}

export default Error