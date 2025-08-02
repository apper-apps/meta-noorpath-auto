import urgeLogData from "@/services/mockData/urgeLogs.json";
import { endOfWeek, isAfter, startOfWeek, subDays } from "date-fns";
class UrgeLogService {
  constructor() {
    this.urgeLogs = [...urgeLogData]
  }

  async getAll() {
    await this.delay()
    return [...this.urgeLogs]
  }

  async getById(id) {
    await this.delay()
    const log = this.urgeLogs.find(l => l.Id === id)
    if (!log) {
      throw new Error(`Urge log with Id ${id} not found`)
    }
    return { ...log }
  }

async create(logData) {
    await this.delay()
    const newLog = {
      Id: Math.max(...this.urgeLogs.map(l => l.Id)) + 1,
      ...logData,
      timestamp: logData.timestamp || new Date().toISOString(),
      transformationPoints: this.calculateTransformationPoints(logData),
      spiritualGrowth: this.calculateSpiritualGrowth(logData)
    }
    this.urgeLogs.push(newLog)
    return { ...newLog }
  }

  calculateTransformationPoints(logData) {
    let points = 10 // Base points for logging
    
    // Bonus for coping strategies
    const strategyPoints = {
      dhikr: 10,
      prayer: 15,
      quran: 12,
      exercise: 8,
      cold_shower: 6,
      call_friend: 5
    }
    
    if (logData.copingStrategy && strategyPoints[logData.copingStrategy]) {
      points += strategyPoints[logData.copingStrategy]
    }
    
    // Bonus for detailed logging
    if (logData.emotionalState) points += 3
    if (logData.notes && logData.notes.length > 10) points += 2
    
    return points
  }

  calculateSpiritualGrowth(logData) {
    const spiritualStrategies = ['dhikr', 'prayer', 'quran']
    return spiritualStrategies.includes(logData.copingStrategy) ? 5 : 1
  }

  async update(id, updates) {
    await this.delay()
    const index = this.urgeLogs.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error(`Urge log with Id ${id} not found`)
    }
    
    this.urgeLogs[index] = { ...this.urgeLogs[index], ...updates }
    return { ...this.urgeLogs[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.urgeLogs.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error(`Urge log with Id ${id} not found`)
    }
    
    return this.urgeLogs.splice(index, 1)[0]
  }

  async getWeeklyLogs(weekStartDate) {
    await this.delay()
    const start = startOfWeek(weekStartDate, { weekStartsOn: 1 })
    const end = endOfWeek(weekStartDate, { weekStartsOn: 1 })
    
    return this.urgeLogs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= start && logDate <= end
    }).map(log => ({ ...log }))
  }

  async getRecentLogs(days = 7) {
    await this.delay()
    const cutoff = subDays(new Date(), days)
    
    return this.urgeLogs.filter(log => 
      isAfter(new Date(log.timestamp), cutoff)
    ).map(log => ({ ...log }))
  }

async getUserLogs(userId) {
    await this.delay()
    return this.urgeLogs
      .filter(log => log.userId === userId)
      .map(log => ({ ...log }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getTransformationStats(userId) {
    await this.delay()
    const userLogs = this.urgeLogs.filter(log => log.userId === userId)
    
    return {
      totalTransformations: userLogs.length,
      totalPointsEarned: userLogs.reduce((sum, log) => sum + (log.transformationPoints || 0), 0),
      totalSpiritualGrowth: userLogs.reduce((sum, log) => sum + (log.spiritualGrowth || 0), 0),
      mostCommonTrigger: this.getMostCommon(userLogs.map(log => log.trigger)),
      mostUsedCoping: this.getMostCommon(userLogs.map(log => log.copingStrategy)),
      averageIntensity: userLogs.length > 0 
        ? (userLogs.reduce((sum, log) => sum + log.intensity, 0) / userLogs.length).toFixed(1)
        : 0
    }
  }

getMostCommon(arr) {
    if (arr.length === 0) return null
    const counts = {}
    arr.forEach(item => counts[item] = (counts[item] || 0) + 1)
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const urgeLogService = new UrgeLogService()