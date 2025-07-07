import { db } from '../../drizzle/db';
import { analytics } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { Analytics } from '../types/analyticsTypes.ts';

export const getAnalytics = async (): Promise<Analytics | null> => {
  const result = await db.select().from(analytics);
  return result[0] || null;
};

export const createAnalytics = async (data: Omit<Analytics, 'id' | 'updatedAt'>): Promise<Analytics> => {
  const [created] = await db.insert(analytics).values(data).returning();
  return created;
};

export const updateAnalytics = async (id: string, data: Partial<Omit<Analytics, 'id' | 'updatedAt'>>): Promise<Analytics | null> => {
  const [updated] = await db.update(analytics).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(analytics.id, id)).returning();
  return updated || null;
};

export const deleteAnalytics = async (id: string): Promise<boolean> => {
  const deleted = await db.delete(analytics).where(eq(analytics.id, id)).returning();
  return !!deleted.length;
};
