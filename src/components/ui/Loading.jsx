import { motion } from "framer-motion"

const Loading = ({ type = "default" }) => {
  if (type === "cards") {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface/60 rounded-xl p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (type === "streak") {
    return (
      <div className="bg-surface/60 rounded-xl p-6 animate-pulse">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 bg-gray-300 rounded-full" />
          <div className="space-y-2 text-center">
            <div className="h-6 bg-gray-300 rounded w-24 mx-auto" />
            <div className="h-4 bg-gray-300 rounded w-16 mx-auto" />
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default Loading