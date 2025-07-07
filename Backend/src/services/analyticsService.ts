/**
 * Analytics Service
 *
 * Diese Datei enthält die Geschäftslogik für das Verwalten der Analytics-Daten (Lernstatistiken).
 * Sie kapselt alle Datenbankoperationen für das Analytics-Modul und wird von den Controllern verwendet.
 *
 * Wichtige Hinweise für Einsteiger:
 * - Die Service-Schicht ist für die Kommunikation mit der Datenbank zuständig.
 * - Sie sollte keine HTTP-spezifische Logik enthalten (das ist Aufgabe der Controller).
 * - Die Analytics-Daten sind aktuell global (nicht benutzerspezifisch).
 * - Für User-spezifische Analytics müsste die Tabelle um eine userId-Spalte erweitert werden.
 *
 * Querverweise:
 * - src/controllers/analyticsController.ts: HTTP-Controller für Analytics-Endpunkte
 * - drizzle/schema.ts: Datenbankschema für Analytics
 * - src/types/analyticsTypes.ts: TypeScript-Typdefinitionen für Analytics
 */

import { db } from '../../drizzle/db';
import { analytics } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { Analytics } from '../types/analyticsTypes.ts';

/**
 * Holt die aktuellen Analytics-Daten aus der Datenbank.
 * Gibt das erste Analytics-Objekt zurück (da aktuell nur ein globaler Datensatz existiert).
 */
export const getAnalytics = async (): Promise<Analytics | null> => {
  const result = await db.select().from(analytics);
  return result[0] || null;
};

/**
 * Legt einen neuen Analytics-Datensatz an.
 * Wird selten benötigt, da meist nur ein globaler Datensatz existiert.
 * @param data Analytics-Daten ohne id und updatedAt
 */
export const createAnalytics = async (data: Omit<Analytics, 'id' | 'updatedAt'>): Promise<Analytics> => {
  const [created] = await db.insert(analytics).values(data).returning();
  return created;
};

/**
 * Aktualisiert einen bestehenden Analytics-Datensatz anhand der ID.
 * @param id ID des Analytics-Datensatzes
 * @param data Zu aktualisierende Felder (ohne id und updatedAt)
 */
export const updateAnalytics = async (id: string, data: Partial<Omit<Analytics, 'id' | 'updatedAt'>>): Promise<Analytics | null> => {
  const [updated] = await db.update(analytics).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(analytics.id, id)).returning();
  return updated || null;
};

/**
 * Löscht einen Analytics-Datensatz anhand der ID.
 * @param id ID des zu löschenden Datensatzes
 * @returns true, wenn ein Datensatz gelöscht wurde, sonst false
 */
export const deleteAnalytics = async (id: string): Promise<boolean> => {
  const deleted = await db.delete(analytics).where(eq(analytics.id, id)).returning();
  return !!deleted.length;
};
