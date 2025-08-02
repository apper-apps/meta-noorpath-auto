import { useState } from "react"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const PartnerCard = ({ partner, onSendMessage, onCheckIn }) => {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState("")
  
  const quickMessages = [
    "Stay strong, brother! 💪",
    "Praying for you today 🤲",
    "How are you feeling?",
    "Let's keep each other accountable",
    "Alhamdulillah for another clean day!"
  ]
  
  const handleSendMessage = (text) => {
    onSendMessage(partner.id, text)
    setMessage("")
  }
  
  const getStatusColor = (lastSeen) => {
    const hoursAgo = (new Date() - new Date(lastSeen)) / (1000 * 60 * 60)
    if (hoursAgo < 1) return "bg-green-500"
    if (hoursAgo < 24) return "bg-yellow-500"
    return "bg-gray-400"
  }
  
  return (
    <Card variant="gradient" className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {partner.username[0].toUpperCase()}
                </span>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(partner.lastSeen)}`} />
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900">
                {partner.username}
              </h4>
              <p className="text-sm text-gray-600">
                Partner since {new Date(partner.partnerSince).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <Badge variant="gradient">
            {partner.sharedStreak} days
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat(!showChat)}
          >
            <ApperIcon name="MessageCircle" size={14} className="mr-1" />
            Chat
          </Button>
          <Button
            size="sm"
            onClick={() => onCheckIn(partner.id)}
          >
            <ApperIcon name="Heart" size={14} className="mr-1" />
            Check-in
          </Button>
        </div>
        
        {showChat && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-2">
              {quickMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(msg)}
                  className="text-left p-2 text-sm bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === "Enter" && message.trim() && handleSendMessage(message)}
              />
              <Button
                size="sm"
                onClick={() => handleSendMessage(message)}
                disabled={!message.trim()}
              >
                <ApperIcon name="Send" size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default PartnerCard