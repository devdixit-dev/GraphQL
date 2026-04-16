import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';

export const userService = {
  async getUsers() {
    return db.select().from(users);
  },

  async createUser(name: string, email: string) {
    const result = await db.insert(users).values({ name, email }).returning();
    return result[0];
  }
};