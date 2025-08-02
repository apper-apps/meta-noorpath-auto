import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { userService } from "@/services/api/userService"

const OnboardingPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    goals: [],
    triggers: [],
    vulnerableTimes: [],
    spiritualCommitment: 3
  })

  const goals = [
    { id: "spiritual_growth", label: "Spiritual Growth", icon: "Star" },
    { id: "self_control", label: "Self Control", icon: "Shield" },
    { id: "productivity", label: "Productivity", icon: "Zap" },
    { id: "relationships", label: "Better Relationships", icon: "Heart" },
    { id: "peace", label: "Inner Peace", icon: "Flower" },
    { id: "purpose", label: "Life Purpose", icon: "Target" }
  ]

  const commonTriggers = [
    { id: "stress", label: "Stress", icon: "Zap" },
    { id: "boredom", label: "Boredom", icon: "Clock" },
    { id: "loneliness", label: "Loneliness", icon: "User" },
    { id: "social_media", label: "Social Media", icon: "Smartphone" },
    { id: "night_time", label: "Late Night", icon: "Moon" },
    { id: "work_pressure", label: "Work Pressure", icon: "Briefcase" }
  ]

  const timeSlots = [
    { id: "morning", label: "Morning (6-12)", icon: "Sun" },
    { id: "afternoon", label: "Afternoon (12-18)", icon: "CloudSun" },
    { id: "evening", label: "Evening (18-22)", icon: "Sunset" },
    { id: "night", label: "Night (22-6)", icon: "Moon" }
  ]

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleComplete = async () => {
    try {
      await userService.createUser({
        name: formData.name,
        goals: formData.goals,
        triggers: formData.triggers,
        vulnerableTimes: formData.vulnerableTimes,
        spiritualCommitment: formData.spiritualCommitment,
        joinDate: new Date().toISOString(),
        currentStreak: 0,
        bestStreak: 0,
        points: 100, // Welcome bonus
        level: 1
      })
      
      toast.success("Welcome to NafsVault! Your journey begins now.")
      navigate("/")
    } catch (error) {
      toast.error("Failed to complete setup. Please try again.")
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Shield" size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white font-display">
                Welcome to NafsVault
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Transform your struggles into strength. Like a black hole, we pull in your urges, 
                wasted time, and bad habits—then transform them into creative energy, productivity, 
                and Islamic purpose.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="text-center text-lg"
              />
            </div>
            
            <Button
              onClick={() => setStep(2)}
              disabled={!formData.name.trim()}
              className="w-full"
              size="lg"
            >
              Begin Your Journey
              <ApperIcon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white font-display">
                What are your goals?
              </h2>
              <p className="text-gray-300">
                Select what you want to achieve through this journey
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleMultiSelect('goals', goal.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    formData.goals.includes(goal.id)
                      ? "border-purple-500 bg-purple-500/20 text-purple-300"
                      : "border-gray-600 hover:border-gray-500 text-gray-300"
                  }`}
                >
                  <ApperIcon name={goal.icon} size={24} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">{goal.label}</div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={formData.goals.length === 0}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white font-display">
                Identify Your Triggers
              </h2>
              <p className="text-gray-300">
                Understanding your triggers helps us provide better support
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {commonTriggers.map((trigger) => (
                <button
                  key={trigger.id}
                  onClick={() => handleMultiSelect('triggers', trigger.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    formData.triggers.includes(trigger.id)
                      ? "border-red-500 bg-red-500/20 text-red-300"
                      : "border-gray-600 hover:border-gray-500 text-gray-300"
                  }`}
                >
                  <ApperIcon name={trigger.icon} size={24} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">{trigger.label}</div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white font-display">
                Vulnerable Times
              </h2>
              <p className="text-gray-300">
                When do you feel most vulnerable to urges?
              </p>
            </div>
            
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleMultiSelect('vulnerableTimes', slot.id)}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center space-x-3 ${
                    formData.vulnerableTimes.includes(slot.id)
                      ? "border-yellow-500 bg-yellow-500/20 text-yellow-300"
                      : "border-gray-600 hover:border-gray-500 text-gray-300"
                  }`}
                >
                  <ApperIcon name={slot.icon} size={20} />
                  <span className="font-medium">{slot.label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(5)} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white font-display">
                Spiritual Commitment
              </h2>
              <p className="text-gray-300">
                How committed are you to using Islamic guidance in your journey?
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-purple-400">
                    {formData.spiritualCommitment}/5
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {formData.spiritualCommitment === 1 && "Just beginning"}
                    {formData.spiritualCommitment === 2 && "Learning slowly"}
                    {formData.spiritualCommitment === 3 && "Moderately committed"}
                    {formData.spiritualCommitment === 4 && "Very committed"}
                    {formData.spiritualCommitment === 5 && "Fully dedicated"}
                  </div>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.spiritualCommitment}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    spiritualCommitment: parseInt(e.target.value) 
                  }))}
                  className="w-full h-2 bg-gray-700 rounded-lg slider"
                />
              </div>
              
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="BookOpen" size={20} className="text-purple-400 mt-1" />
                  <div>
                    <p className="text-purple-300 text-sm leading-relaxed">
                      "And whoever relies upon Allah - then He is sufficient for him. 
                      Indeed, Allah will accomplish His purpose."
                    </p>
                    <p className="text-purple-400 text-xs mt-1">- Quran 65:3</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                <ApperIcon name="Rocket" size={16} className="mr-2" />
                Start Journey
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card variant="glass" className="p-8 bg-gray-900/80 backdrop-blur-xl border-gray-700">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i <= step ? "bg-purple-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OnboardingPage