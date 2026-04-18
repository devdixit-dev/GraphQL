import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';

export const userService = {
  async getUsers() {
    return db.select().from(users);
    // return the all data from users table
  },

  async createUser(name: string, email: string) {
    const result = await db.insert(users).values({ name, email }).returning();
    // create the user with name and email, insert it into users table and return the data
    return result[0];
    // return the first index from result variable
  },

  async updateUser(id: number, name: string) {
    const updated = await db.update(users).set({ name }).where(eq(users.id, id)).returning();
    // update users name in users table where users.id = id (that user enters), set name (that users pass) and return the updated data
    return updated[0]
    // return the first row of updated data
  },

  async deleteUser(id: number) {
    const deleted = await db.delete(users).where(eq(users.id, id)).returning();
    return deleted[0]
  }
};