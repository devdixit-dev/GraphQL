import { db } from "../../db"
import { tasks } from "../../db/schema"

export const taskService = {
  async getTasks() {
    return db.select().from(tasks);
  }
}