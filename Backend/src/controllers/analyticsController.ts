/**
 * Analytics Controller
 *
 * Diese Datei enthält die HTTP-Controller für alle Analytics-Endpunkte.
 * Sie nimmt HTTP-Anfragen entgegen, ruft die Service-Methoden auf und sendet die HTTP-Antworten zurück.
 *
 * Hinweise für Einsteiger:
 * - Controller sind für die HTTP-spezifische Logik zuständig (z.B. Statuscodes, Fehlerbehandlung).
 * - Die eigentliche Datenbanklogik steckt im Service (siehe src/services/analyticsService.ts).
 * - Die Controller werden in den Routen (src/routes/analyticsRoutes.ts) verwendet.
 *
 * Querverweise:
 * - src/services/analyticsService.ts: Geschäftslogik für Analytics
 * - src/routes/analyticsRoutes.ts: Routing der Analytics-Endpunkte
 * - drizzle/schema.ts: Datenbankschema
 */

import * as analyticsService from '../services/analyticsService';
import { Request, Response, NextFunction } from 'express';

/**
 * GET /api/analytics
 * Gibt die aktuellen Analytics-Daten zurück.
 */
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getAnalytics();
    if (!data) {
      res.status(404).json({ message: 'Analytics not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/analytics
 * Legt einen neuen Analytics-Datensatz an.
 */
export const createAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.createAnalytics(req.body as Omit<import('../types/analyticsTypes').Analytics, 'id' | 'updatedAt'>);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/analytics/:id
 * Aktualisiert einen Analytics-Datensatz anhand der ID.
 */
export const updateAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await analyticsService.updateAnalytics(id, req.body as Partial<Omit<import('../types/analyticsTypes').Analytics, 'id' | 'updatedAt'>>);
    if (!data) {
      res.status(404).json({ message: 'Analytics not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/analytics/:id
 * Löscht einen Analytics-Datensatz anhand der ID.
 */
export const deleteAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await analyticsService.deleteAnalytics(id);
    if (!deleted) {
      res.status(404).json({ message: 'Analytics not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
