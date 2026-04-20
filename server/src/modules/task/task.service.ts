import { eq } from "drizzle-orm";
import { db } from "../../db"
import { tasks } from "../../db/schema"

export const taskService = {
  async getTasks() {
    return db.select().from(tasks);
  },

  async createTask(id: number, name: string, desc: string) {
    const result = await db.insert(tasks).values({ name, desc, owner: id })
    .returning();
    return result[0];
  },

  async updateTask(id: number, name: string, desc: string) {
    const updated = await db.update(tasks).set({ name, desc })
    .where(eq(tasks.id, id)).returning();
    return updated[0]
  },

  async deleteTask(id: number) {
    const deleted = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return deleted[0];
  }
}