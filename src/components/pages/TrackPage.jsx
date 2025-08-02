import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { urgeLogService } from "@/services/api/urgeLogService"

const TrackPage = () => {
  const [urgeLogs, setUrgeLogs] = useState([])
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    loadUrgeLogs()
  }, [selectedWeek])
  
  const loadUrgeLogs = async () => {
    try {
      setError("")
      setLoading(true)
      
      const logs = await urgeLogService.getWeeklyLogs(selectedWeek)
      setUrgeLogs(logs)
    } catch (err) {
      setError("Failed to load urge logs")
      console.error("Error loading urge logs:", err)
    } finally {
      setLoading(false)
    }
  }
  
  const getWeekDays = () => {
    const start = startOfWeek(selectedWeek, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }
  
  const getLogsForDay = (date) => {
    return urgeLogs.filter(log => 
      isSameDay(new Date(log.timestamp), date)
    )
  }
  
  const getIntensityColor = (intensity) => {
    const colors = {
      1: "bg-green-100 text-green-800 border-green-200",
      2: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      3: "bg-orange-100 text-orange-800 border-orange-200",
      4: "bg-red-100 text-red-800 border-red-200",
      5: "bg-red-200 text-red-900 border-red-300"
    }
    return colors[intensity] || colors[3]
  }
  
  const getTriggerIcon = (trigger) => {
    const icons = {
      stress: "Zap",
      boredom: "Clock",
      loneliness: "User",
      anger: "Flame",
      curiosity: "Eye",
      habit: "RotateCcw"
    }
    return icons[trigger] || "AlertCircle"
  }
  
  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek)
    newDate.setDate(newDate.getDate() + (direction * 7))
    setSelectedWeek(newDate)
  }
  
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
        <Error message={error} onRetry={loadUrgeLogs} />
      </div>
    )
  }
  
  const weekDays = getWeekDays()
  const totalLogs = urgeLogs.length
  const averageIntensity = totalLogs > 0 
    ? (urgeLogs.reduce((sum, log) => sum + log.intensity, 0) / totalLogs).toFixed(1)
    : 0
  
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Track Progress
          </h1>
          <p className="text-gray-600">
            Monitor your journey and identify patterns
          </p>
        </div>
      </div>
      
      {/* Week Navigation */}
      <Card variant="default" className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek(-1)}
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          
          <h2 className="font-semibold text-gray-900 font-display">
            Week of {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d")}
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek(1)}
            disabled={format(weekDays[6], "yyyy-MM-dd") >= format(new Date(), "yyyy-MM-dd")}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      </Card>
      
      {/* Week Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="gradient" className="p-4 text-center">
          <div className="space-y-2">
            <ApperIcon name="AlertTriangle" size={24} className="text-accent-600 mx-auto" />
            <div className="text-2xl font-bold text-accent-700 font-display">
              {totalLogs}
            </div>
            <div className="text-sm text-gray-600">Total Urges</div>
          </div>
        </Card>
        
        <Card variant="gradient" className="p-4 text-center">
          <div className="space-y-2">
            <ApperIcon name="BarChart3" size={24} className="text-primary-600 mx-auto" />
            <div className="text-2xl font-bold text-primary-700 font-display">
              {averageIntensity}
            </div>
            <div className="text-sm text-gray-600">Avg Intensity</div>
          </div>
        </Card>
      </div>
      
      {/* Daily Calendar */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 font-display">
          Daily Overview
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          {weekDays.map((day) => {
            const dayLogs = getLogsForDay(day)
            const isToday = isSameDay(day, new Date())
            
            return (
              <Card
                key={day.toString()}
                variant={isToday ? "elevated" : "default"}
                className="p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 font-display">
                        {format(day, "d")}
                      </div>
                      <div className="text-xs text-gray-600">
                        {format(day, "EEE")}
                      </div>
                      {isToday && (
                        <Badge variant="accent" className="text-xs mt-1">
                          Today
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {dayLogs.length === 0 ? (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="CheckCircle" size={16} className="text-green-500" />
                          <span className="text-sm text-green-600 font-medium">
                            Clean day!
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            {dayLogs.length} urge{dayLogs.length > 1 ? "s" : ""} logged
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {dayLogs.map((log) => (
                              <Badge
                                key={log.Id}
                                className={`text-xs ${getIntensityColor(log.intensity)}`}
                              >
                                <ApperIcon 
                                  name={getTriggerIcon(log.trigger)} 
                                  size={10} 
                                  className="mr-1" 
                                />
                                {log.intensity}/5
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {dayLogs.length === 0 && (
                    <ApperIcon name="Star" size={20} className="text-yellow-500" />
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
      
      {/* Insights */}
      {totalLogs > 0 ? (
        <Card variant="glass" className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Weekly Insights
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <ApperIcon name="TrendingDown" size={16} className="text-green-500" />
                <span className="text-sm text-gray-700">
                  Stay consistent with your tracking to identify patterns
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Heart" size={16} className="text-primary-500" />
                <span className="text-sm text-gray-700">
                  Remember: Each logged urge is a step toward self-awareness
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Sunrise" size={16} className="text-accent-500" />
                <span className="text-sm text-gray-700">
                  Tomorrow is a new opportunity for growth
                </span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Empty
          title="Great work this week!"
          description="No urges logged means you're staying strong. Keep up the excellent progress!"
          icon="Award"
          actionLabel="View All Progress"
          onAction={() => {}}
        />
      )}
    </div>
  )
}

export default TrackPage