import userData from "@/services/mockData/users.json"

class UserService {
  constructor() {
    this.users = [...userData]
  }

  async getAll() {
    await this.delay()
    return [...this.users]
  }

  async getById(id) {
    await this.delay()
    const user = this.users.find(u => u.Id === id)
    if (!user) {
      throw new Error(`User with Id ${id} not found`)
    }
    return { ...user }
  }

  async create(userData) {
    await this.delay()
    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      createdAt: new Date().toISOString(),
      ...userData
    }
    this.users.push(newUser)
    return { ...newUser }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.users.findIndex(u => u.Id === id)
    if (index === -1) {
      throw new Error(`User with Id ${id} not found`)
    }
    
    this.users[index] = { ...this.users[index], ...updates }
    return { ...this.users[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.users.findIndex(u => u.Id === id)
    if (index === -1) {
      throw new Error(`User with Id ${id} not found`)
    }
    
    return this.users.splice(index, 1)[0]
  }

  async addPoints(id, points) {
    await this.delay()
    const user = await this.getById(id)
    return await this.update(id, { 
      points: (user.points || 0) + points 
    })
  }

  async updateStreak(id, newStreak) {
    await this.delay()
    const user = await this.getById(id)
    const bestStreak = Math.max(user.bestStreak || 0, newStreak)
    
    return await this.update(id, { 
      currentStreak: newStreak,
      bestStreak,
      totalCleanDays: (user.totalCleanDays || 0) + 1
    })
  }

  async resetStreak(id) {
    await this.delay()
    return await this.update(id, { currentStreak: 0 })
  }

  async getAvailablePartners() {
    await this.delay()
    return this.users
      .filter(u => u.Id !== 1 && !u.partnerId)
      .map(u => ({ ...u }))
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const userService = new UserService()