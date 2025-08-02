import { useState, useEffect } from "react"
import { format, subDays } from "date-fns"
import Chart from "react-apexcharts"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Progress from "@/components/atoms/Progress"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { userService } from "@/services/api/userService"
import { urgeLogService } from "@/services/api/urgeLogService"

const ProgressPage = () => {
  const [userData, setUserData] = useState(null)
  const [chartData, setChartData] = useState({ urges: [], dates: [] })
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState("7d")
  
  useEffect(() => {
    loadProgressData()
  }, [timeRange])
  
  const loadProgressData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [user, logs] = await Promise.all([
        userService.getById(1),
        urgeLogService.getRecentLogs(timeRange === "7d" ? 7 : 30)
      ])
      
      setUserData(user)
      
      // Process chart data
      const days = timeRange === "7d" ? 7 : 30
      const dates = Array.from({ length: days }, (_, i) => 
        format(subDays(new Date(), days - 1 - i), "MMM d")
      )
      
      const urgesByDay = Array.from({ length: days }, (_, i) => {
        const date = subDays(new Date(), days - 1 - i)
        return logs.filter(log => 
          format(new Date(log.timestamp), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
        ).length
      })
      
      setChartData({ urges: urgesByDay, dates })
      
      // Set milestones
      const allMilestones = [
        { days: 7, title: "First Week", achieved: user.currentStreak >= 7 },
        { days: 30, title: "First Month", achieved: user.currentStreak >= 30 },
        { days: 90, title: "90 Days Strong", achieved: user.currentStreak >= 90 },
        { days: 180, title: "Half Year", achieved: user.currentStreak >= 180 },
        { days: 365, title: "One Full Year", achieved: user.currentStreak >= 365 }
      ]
      
      setMilestones(allMilestones)
    } catch (err) {
      setError("Failed to load progress data")
      console.error("Error loading progress data:", err)
    } finally {
      setLoading(false)
    }
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
        <Error message={error} onRetry={loadProgressData} />
      </div>
    )
  }
  
  const chartOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
      background: "transparent"
    },
    colors: ["#2C5F2D"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 3
    },
    xaxis: {
      categories: chartData.dates,
      labels: {
        style: { colors: "#6b7280", fontSize: "12px" }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      labels: {
        style: { colors: "#6b7280", fontSize: "12px" }
      }
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value} urge${value !== 1 ? "s" : ""}`
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    }
  }
  
  const nextMilestone = milestones.find(m => !m.achieved)
  const achievedMilestones = milestones.filter(m => m.achieved)
  
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Your Progress
          </h1>
          <p className="text-gray-600">
            Celebrate your journey of growth
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === "7d"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === "30d"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            30D
          </button>
        </div>
      </div>
      
      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="gradient" className="p-4 text-center">
          <div className="space-y-2">
            <ApperIcon name="Flame" size={24} className="text-primary-600 mx-auto" />
            <div className="text-2xl font-bold text-primary-700 font-display">
              {userData?.currentStreak || 0}
            </div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
        </Card>
        
        <Card variant="gradient" className="p-4 text-center">
          <div className="space-y-2">
            <ApperIcon name="Trophy" size={24} className="text-accent-600 mx-auto" />
            <div className="text-2xl font-bold text-accent-700 font-display">
              {userData?.bestStreak || 0}
            </div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
        </Card>
      </div>
      
      {/* Urge Trend Chart */}
      <Card variant="default" className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Urge Frequency Trend
          </h3>
          
          <div className="h-[300px]">
            <Chart
              options={chartOptions}
              series={[{
                name: "Daily Urges",
                data: chartData.urges
              }]}
              type="area"
              height={300}
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Lower numbers indicate better self-control over time
            </p>
          </div>
        </div>
      </Card>
      
      {/* Next Milestone */}
      {nextMilestone && (
        <Card variant="elevated" className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Next Milestone
              </h3>
              <Badge variant="accent">
                {nextMilestone.days - userData.currentStreak} days to go
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{nextMilestone.title}</span>
                <span className="text-sm text-gray-600">
                  {userData.currentStreak}/{nextMilestone.days} days
                </span>
              </div>
              
              <Progress
                value={userData.currentStreak}
                max={nextMilestone.days}
                variant="primary"
                className="h-3"
              />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Keep going! You're {Math.round((userData.currentStreak / nextMilestone.days) * 100)}% there
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Achievements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 font-display">
          Achievements
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {milestones.map((milestone) => (
            <Card
              key={milestone.days}
              variant={milestone.achieved ? "gradient" : "default"}
              className={`p-4 ${milestone.achieved ? "" : "opacity-60"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    milestone.achieved 
                      ? "bg-primary-600 text-white" 
                      : "bg-gray-200 text-gray-400"
                  }`}>
                    <ApperIcon 
                      name={milestone.achieved ? "CheckCircle" : "Circle"} 
                      size={20} 
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {milestone.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {milestone.days} days clean
                    </p>
                  </div>
                </div>
                
                {milestone.achieved && (
                  <Badge variant="success">
                    <ApperIcon name="Star" size={12} className="mr-1" />
                    Achieved
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Stats Summary */}
      <Card variant="glass" className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600 font-display">
              {userData?.totalCleanDays || 0}
            </div>
            <div className="text-sm text-gray-600">Total Clean Days</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 font-display">
              {userData?.points || 0}
            </div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
        </div>
        
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-700 font-medium">
            "And give good tidings to those who believe and do righteous deeds"
          </p>
          <p className="text-sm text-gray-500">- Quran 2:25</p>
        </div>
      </Card>
    </div>
  )
}

export default ProgressPage