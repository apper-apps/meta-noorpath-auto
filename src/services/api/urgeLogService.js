import urgeLogData from "@/services/mockData/urgeLogs.json"
import { format, isAfter, subDays, startOfWeek, endOfWeek } from "date-fns"

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
      timestamp: logData.timestamp || new Date().toISOString()
    }
    this.urgeLogs.push(newLog)
    return { ...newLog }
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
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const urgeLogService = new UrgeLogService()