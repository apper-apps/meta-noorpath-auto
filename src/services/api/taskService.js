import taskData from "@/services/mockData/tasks.json"

class TaskService {
  constructor() {
    this.tasks = [...taskData]
    this.completedTasks = new Set()
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(t => t.Id === id)
    if (!task) {
      throw new Error(`Task with Id ${id} not found`)
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id)) + 1,
      ...taskData
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error(`Task with Id ${id} not found`)
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updates }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error(`Task with Id ${id} not found`)
    }
    
    return this.tasks.splice(index, 1)[0]
  }

  async getUrgentTasks(limit = 5) {
    await this.delay()
    return this.tasks
      .filter(task => task.duration <= 10)
      .slice(0, limit)
      .map(task => ({ ...task }))
  }

  async getByCategory(category) {
    await this.delay()
    return this.tasks
      .filter(task => task.category === category)
      .map(task => ({ ...task }))
  }

  async completeTask(id) {
    await this.delay()
    this.completedTasks.add(id)
    return { success: true, taskId: id }
  }

  async isTaskCompleted(id) {
    return this.completedTasks.has(id)
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const taskService = new TaskService()