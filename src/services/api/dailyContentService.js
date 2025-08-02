import dailyContentData from "@/services/mockData/dailyContent.json"

class DailyContentService {
  constructor() {
    this.content = [...dailyContentData]
  }

  async getAll() {
    await this.delay()
    return [...this.content]
  }

  async getById(id) {
    await this.delay()
    const content = this.content.find(c => c.Id === id)
    if (!content) {
      throw new Error(`Daily content with Id ${id} not found`)
    }
    return { ...content }
  }

  async create(contentData) {
    await this.delay()
    const newContent = {
      Id: Math.max(...this.content.map(c => c.Id)) + 1,
      date: new Date().toISOString().split("T")[0],
      ...contentData
    }
    this.content.push(newContent)
    return { ...newContent }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.content.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error(`Daily content with Id ${id} not found`)
    }
    
    this.content[index] = { ...this.content[index], ...updates }
    return { ...this.content[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.content.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error(`Daily content with Id ${id} not found`)
    }
    
    return this.content.splice(index, 1)[0]
  }

  async getTodayContent() {
    await this.delay()
    const today = new Date().toISOString().split("T")[0]
    let todayContent = this.content.find(c => c.date === today)
    
    if (!todayContent) {
      todayContent = this.getRandomContent()
    }
    
    return { ...todayContent }
  }

  async getRandomContent() {
    await this.delay()
    const randomIndex = Math.floor(Math.random() * this.content.length)
    return { ...this.content[randomIndex] }
  }

  async getByType(type) {
    await this.delay()
    return this.content
      .filter(c => c.type === type)
      .map(c => ({ ...c }))
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const dailyContentService = new DailyContentService()