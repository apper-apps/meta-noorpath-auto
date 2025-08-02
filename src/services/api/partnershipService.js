import partnershipData from "@/services/mockData/partnerships.json"

class PartnershipService {
  constructor() {
    this.partnerships = [...partnershipData]
    this.messages = []
  }

  async getAll() {
    await this.delay()
    return [...this.partnerships]
  }

  async getById(id) {
    await this.delay()
    const partnership = this.partnerships.find(p => p.Id === id)
    if (!partnership) {
      throw new Error(`Partnership with Id ${id} not found`)
    }
    return { ...partnership }
  }

  async create(partnershipData) {
    await this.delay()
    const newPartnership = {
      Id: Math.max(...this.partnerships.map(p => p.Id)) + 1,
      sharedStreak: 0,
      createdAt: new Date().toISOString(),
      lastCheckIn: new Date().toISOString(),
      ...partnershipData
    }
    this.partnerships.push(newPartnership)
    return { ...newPartnership }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.partnerships.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error(`Partnership with Id ${id} not found`)
    }
    
    this.partnerships[index] = { ...this.partnerships[index], ...updates }
    return { ...this.partnerships[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.partnerships.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error(`Partnership with Id ${id} not found`)
    }
    
    return this.partnerships.splice(index, 1)[0]
  }

  async getCurrentPartnership(userId) {
    await this.delay()
    const partnership = this.partnerships.find(p => 
      p.user1Id === userId || p.user2Id === userId
    )
    return partnership ? { ...partnership } : null
  }

  async requestPartnership(userId, partnerId) {
    await this.delay()
    const newPartnership = await this.create({
      user1Id: userId,
      user2Id: partnerId,
      status: "pending"
    })
    return newPartnership
  }

  async acceptPartnership(partnershipId) {
    await this.delay()
    return await this.update(partnershipId, { 
      status: "active",
      acceptedAt: new Date().toISOString()
    })
  }

  async endPartnership(userId) {
    await this.delay()
    const partnership = await this.getCurrentPartnership(userId)
    if (partnership) {
      return await this.delete(partnership.Id)
    }
    return null
  }

  async sendMessage(fromUserId, toUserId, message) {
    await this.delay()
    const newMessage = {
      id: this.messages.length + 1,
      fromUserId,
      toUserId,
      message,
      timestamp: new Date().toISOString()
    }
    this.messages.push(newMessage)
    return { ...newMessage }
  }

  async checkIn(userId, partnerId) {
    await this.delay()
    const partnership = await this.getCurrentPartnership(userId)
    if (partnership) {
      return await this.update(partnership.Id, {
        lastCheckIn: new Date().toISOString(),
        sharedStreak: partnership.sharedStreak + 1
      })
    }
    return null
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const partnershipService = new PartnershipService()