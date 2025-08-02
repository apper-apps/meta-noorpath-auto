import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const QuickLogButton = ({ onLog }) => {
const [showModal, setShowModal] = useState(false)
  const [intensity, setIntensity] = useState(3)
  const [trigger, setTrigger] = useState("")
  const [emotionalState, setEmotionalState] = useState("")
  const [copingStrategy, setCopingStrategy] = useState("")
  const [notes, setNotes] = useState("")
  const triggers = [
    { id: "stress", label: "Stress", icon: "Zap" },
    { id: "boredom", label: "Boredom", icon: "Clock" },
    { id: "loneliness", label: "Loneliness", icon: "User" },
    { id: "anger", label: "Anger", icon: "Flame" },
    { id: "curiosity", label: "Curiosity", icon: "Eye" },
    { id: "habit", label: "Habit", icon: "RotateCcw" }
  ]
  
const emotionalStates = [
    { id: "anxious", label: "Anxious", icon: "Zap", color: "red" },
    { id: "lonely", label: "Lonely", icon: "User", color: "blue" },
    { id: "stressed", label: "Stressed", icon: "Brain", color: "orange" },
    { id: "bored", label: "Bored", icon: "Clock", color: "gray" },
    { id: "angry", label: "Angry", icon: "Flame", color: "red" },
    { id: "sad", label: "Sad", icon: "CloudRain", color: "blue" }
  ]

  const copingStrategies = [
    { id: "dhikr", label: "Dhikr/Remembrance", icon: "Heart", reward: "+10 Spiritual Points" },
    { id: "prayer", label: "Extra Prayer", icon: "Pray", reward: "+15 Spiritual Points" },
    { id: "quran", label: "Quran Recitation", icon: "BookOpen", reward: "+12 Spiritual Points" },
    { id: "exercise", label: "Physical Exercise", icon: "Dumbbell", reward: "+8 Energy Points" },
    { id: "cold_shower", label: "Cold Shower", icon: "Droplets", reward: "+6 Discipline Points" },
    { id: "call_friend", label: "Call a Friend", icon: "Phone", reward: "+5 Social Points" }
  ]

  const handleSubmit = async () => {
    await onLog({
      intensity,
      trigger,
      emotionalState,
      copingStrategy,
      notes,
      timestamp: new Date(),
      userId: 1
    })
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setIntensity(3)
    setTrigger("")
    setEmotionalState("")
    setCopingStrategy("")
    setNotes("")
  }
  
  return (
    <>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <Button
          size="xl"
          className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-accent-500 to-accent-400"
          onClick={() => setShowModal(true)}
        >
          <ApperIcon name="AlertTriangle" size={28} />
        </Button>
      </motion.div>
      
<AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <Card variant="glass" className="p-6 bg-gray-900/95 border-purple-500/30">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="Shield" size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white font-display">
                      Transform This Moment
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      You're taking the right step. Let's turn this into strength.
                    </p>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Intensity Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Urge Intensity: {intensity}/5
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(intensity-1)*25}%, #374151 ${(intensity-1)*25}%, #374151 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Mild</span>
                        <span>Overwhelming</span>
                      </div>
                    </div>
                    
                    {/* Trigger Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-3">
                        What triggered this urge?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {triggers.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTrigger(t.id)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                              trigger === t.id
                                ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                : "border-gray-600 hover:border-gray-500 text-gray-300"
                            }`}
                          >
                            <ApperIcon name={t.icon} size={16} />
                            <span className="text-sm">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Emotional State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-3">
                        How are you feeling right now?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {emotionalStates.map((state) => (
                          <button
                            key={state.id}
                            onClick={() => setEmotionalState(state.id)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                              emotionalState === state.id
                                ? `border-${state.color}-500 bg-${state.color}-500/20 text-${state.color}-300`
                                : "border-gray-600 hover:border-gray-500 text-gray-300"
                            }`}
                          >
                            <ApperIcon name={state.icon} size={16} />
                            <span className="text-sm">{state.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Coping Strategy */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-3">
                        Choose your transformation action:
                      </label>
                      <div className="space-y-2">
                        {copingStrategies.map((strategy) => (
                          <button
                            key={strategy.id}
                            onClick={() => setCopingStrategy(strategy.id)}
                            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                              copingStrategy === strategy.id
                                ? "border-green-500 bg-green-500/20 text-green-300"
                                : "border-gray-600 hover:border-gray-500 text-gray-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <ApperIcon name={strategy.icon} size={16} />
                              <span className="text-sm font-medium">{strategy.label}</span>
                            </div>
                            <span className="text-xs text-green-400">{strategy.reward}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Optional Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Additional thoughts (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="What else is on your mind?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 resize-none h-20"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                      onClick={handleSubmit}
                      disabled={!trigger || !emotionalState}
                    >
                      <ApperIcon name="Zap" size={16} className="mr-2" />
                      Transform Energy
                    </Button>
                  </div>

                  {/* Spiritual Reminder */}
                  <div className="text-center pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 italic">
                      "And Allah will not waste the reward of the believers" - Quran 3:171
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default QuickLogButton