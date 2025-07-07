/**
 * Analytics Routes
 *
 * Definiert die REST-API-Endpunkte für das Analytics-Modul (Lernstatistiken).
 *
 * Hinweise für Einsteiger:
 * - Diese Datei verbindet die HTTP-Routen mit den Controller-Methoden.
 * - Die eigentliche Logik steckt im Controller (src/controllers/analyticsController.ts).
 * - Die Routen werden im Express-Hauptserver (api/index.ts) eingebunden.
 *
 * Querverweise:
 * - src/controllers/analyticsController.ts: Controller-Logik
 * - src/services/analyticsService.ts: Datenbank- und Geschäftslogik
 */

import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';

const router = Router();

// GET: Analytics-Daten abrufen
router.get('/', analyticsController.getAnalytics);

// POST: Analytics-Datensatz anlegen
router.post('/', analyticsController.createAnalytics);

// PUT: Analytics-Datensatz aktualisieren
router.put('/:id', analyticsController.updateAnalytics);

// DELETE: Analytics-Datensatz löschen
router.delete('/:id', analyticsController.deleteAnalytics);

export default router;
