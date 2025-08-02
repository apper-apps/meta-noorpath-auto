import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import PartnerCard from "@/components/molecules/PartnerCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { partnershipService } from "@/services/api/partnershipService"
import { userService } from "@/services/api/userService"

const PartnersPage = () => {
  const [currentPartner, setCurrentPartner] = useState(null)
  const [availablePartners, setAvailablePartners] = useState([])
  const [sharedStreak, setSharedStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showMatchmaking, setShowMatchmaking] = useState(false)
  
  useEffect(() => {
    loadPartnerData()
  }, [])
  
  const loadPartnerData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const partnership = await partnershipService.getCurrentPartnership(1)
      
      if (partnership) {
        const partner = await userService.getById(
          partnership.user1Id === 1 ? partnership.user2Id : partnership.user1Id
        )
        setCurrentPartner({
          ...partner,
          sharedStreak: partnership.sharedStreak,
          partnerSince: partnership.createdAt,
          lastSeen: partnership.lastCheckIn
        })
        setSharedStreak(partnership.sharedStreak)
      } else {
        const available = await userService.getAvailablePartners()
        setAvailablePartners(available)
      }
    } catch (err) {
      setError("Failed to load partner data")
      console.error("Error loading partner data:", err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSendMessage = async (partnerId, message) => {
    try {
      await partnershipService.sendMessage(1, partnerId, message)
      toast.success("Message sent! May Allah bless your friendship.")
    } catch (err) {
      toast.error("Failed to send message")
      console.error("Error sending message:", err)
    }
  }
  
  const handleCheckIn = async (partnerId) => {
    try {
      await partnershipService.checkIn(1, partnerId)
      toast.success("Check-in complete! Supporting each other is beautiful.")
      loadPartnerData() // Refresh data
    } catch (err) {
      toast.error("Failed to check in")
      console.error("Error checking in:", err)
    }
  }
  
  const handleRequestPartner = async (partnerId) => {
    try {
      await partnershipService.requestPartnership(1, partnerId)
      toast.success("Partnership request sent! Waiting for response.")
      loadPartnerData()
    } catch (err) {
      toast.error("Failed to send partnership request")
      console.error("Error requesting partnership:", err)
    }
  }
  
  const handleEndPartnership = async () => {
    try {
      await partnershipService.endPartnership(1)
      toast.info("Partnership ended peacefully. You can find a new partner anytime.")
      setCurrentPartner(null)
      loadPartnerData()
    } catch (err) {
      toast.error("Failed to end partnership")
      console.error("Error ending partnership:", err)
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
        <Error message={error} onRetry={loadPartnerData} />
      </div>
    )
  }
  
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Accountability Partners
          </h1>
          <p className="text-gray-600">
            Support each other on this journey
          </p>
        </div>
        
        {currentPartner && (
          <Badge variant="gradient" className="px-3 py-2">
            <ApperIcon name="Users" size={16} className="mr-1" />
            {sharedStreak} days
          </Badge>
        )}
      </div>
      
      {/* Current Partner */}
      {currentPartner ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Your Partner
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEndPartnership}
              className="text-red-500 hover:text-red-600"
            >
              <ApperIcon name="UserMinus" size={16} className="mr-1" />
              End Partnership
            </Button>
          </div>
          
          <PartnerCard
            partner={currentPartner}
            onSendMessage={handleSendMessage}
            onCheckIn={handleCheckIn}
          />
          
          {/* Shared Progress */}
          <Card variant="gradient" className="p-6">
            <div className="text-center space-y-4">
              <ApperIcon name="Handshake" size={32} className="text-primary-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  Shared Journey
                </h3>
                <p className="text-gray-600">
                  Together for {sharedStreak} clean days
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600 font-display">
                    {Math.floor(sharedStreak / 7)}
                  </div>
                  <div className="text-sm text-gray-600">Weeks Together</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600 font-display">
                    100%
                  </div>
                  <div className="text-sm text-gray-600">Support Rate</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* No Partner - Show Available Partners */
        <div className="space-y-6">
          <Card variant="glass" className="p-6">
            <div className="text-center space-y-4">
              <ApperIcon name="Users" size={32} className="text-primary-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  Find Your Accountability Partner
                </h3>
                <p className="text-gray-600">
                  "And cooperate in righteousness and piety, but do not cooperate in sin and aggression."
                </p>
                <p className="text-sm text-gray-500 mt-2">- Quran 5:2</p>
              </div>
              
              <Button onClick={() => setShowMatchmaking(true)}>
                <ApperIcon name="UserPlus" size={16} className="mr-2" />
                Find Partner
              </Button>
            </div>
          </Card>
          
          {/* Available Partners */}
          {showMatchmaking && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 font-display">
                Available Partners
              </h2>
              
              {availablePartners.length === 0 ? (
                <Empty
                  title="No partners available right now"
                  description="Check back later or invite a friend to join NoorPath"
                  icon="Users"
                  actionLabel="Refresh"
                  onAction={loadPartnerData}
                />
              ) : (
                <div className="space-y-3">
                  {availablePartners.map((partner) => (
                    <Card key={partner.Id} variant="default" className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {partner.username[0].toUpperCase()}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {partner.username}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Current streak: {partner.currentStreak} days</span>
                              <span>Best: {partner.bestStreak} days</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleRequestPartner(partner.Id)}
                        >
                          <ApperIcon name="UserPlus" size={14} className="mr-1" />
                          Request
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Benefits Section */}
      <Card variant="gradient" className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Benefits of Partnership
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Shield" size={16} className="text-primary-500" />
              <span className="text-sm text-gray-700">
                Mutual accountability and support
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <ApperIcon name="MessageCircle" size={16} className="text-secondary-500" />
              <span className="text-sm text-gray-700">
                Daily check-ins and encouragement
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <ApperIcon name="Target" size={16} className="text-accent-500" />
              <span className="text-sm text-gray-700">
                Shared goals and milestone celebrations
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <ApperIcon name="Heart" size={16} className="text-red-500" />
              <span className="text-sm text-gray-700">
                Brotherhood in faith and personal growth
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PartnersPage