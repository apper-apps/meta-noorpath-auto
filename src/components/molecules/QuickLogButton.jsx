import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const QuickLogButton = ({ onLog }) => {
  const [showModal, setShowModal] = useState(false)
  const [intensity, setIntensity] = useState(3)
  const [trigger, setTrigger] = useState("")
  
  const triggers = [
    { id: "stress", label: "Stress", icon: "Zap" },
    { id: "boredom", label: "Boredom", icon: "Clock" },
    { id: "loneliness", label: "Loneliness", icon: "User" },
    { id: "anger", label: "Anger", icon: "Flame" },
    { id: "curiosity", label: "Curiosity", icon: "Eye" },
    { id: "habit", label: "Habit", icon: "RotateCcw" }
  ]
  
  const handleSubmit = async () => {
    await onLog({
      intensity,
      trigger,
      timestamp: new Date()
    })
    setShowModal(false)
    setIntensity(3)
    setTrigger("")
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
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md"
            >
              <Card variant="glass" className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 font-display">
                      Log Your Urge
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      You"re taking the right step by acknowledging this
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intensity Level: {intensity}/5
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Mild</span>
                        <span>Strong</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What triggered this?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {triggers.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTrigger(t.id)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                              trigger === t.id
                                ? "border-primary-500 bg-primary-50 text-primary-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <ApperIcon name={t.icon} size={16} />
                            <span className="text-sm">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={!trigger}
                    >
                      <ApperIcon name="Check" size={16} className="mr-2" />
                      Log Urge
                    </Button>
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