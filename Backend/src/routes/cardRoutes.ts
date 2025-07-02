/**
 * Card Routes
 *
 * Defines REST API endpoints for flashcard operations including:
 * - Global card operations (search across all folders)
 * - Individual card CRUD operations
 * - Advanced filtering, sorting, and pagination
 *
 * Base path: /api/cards
 *
 * Note: For folder-specific card operations, see folderRoutes.ts
 */

import express from 'express';
import * as cardController from '../controllers/cardController';

const router = express.Router();

// =============================================================================
// GLOBAL CARD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Alle Karten mit erweiterten Filter- und Sortieroptionen abrufen
 *     description: Durchsucht alle Karten systemweit mit verschiedenen Filteroptionen
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter nach spezifischem Ordner
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter nach Tags (kommagetrennt)
 *         example: "javascript,frontend"
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter nach Titel (partielle Übereinstimmung)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Anzahl der Karten pro Seite
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Anzahl der zu überspringenden Karten für Paginierung
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, currentLearningLevel]
 *         description: Feld nach dem sortiert werden soll
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sortierreihenfolge
 *     responses:
 *       200:
 *         description: Liste der gefilterten Karten
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     cards:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Card'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         limit:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *                         total:
 *                           type: integer
 *       400:
 *         description: Ungültige Parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', cardController.getAllCards);

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Neue Karte erstellen
 *     description: Erstellt eine neue Karteikarte und ordnet sie einem Ordner zu
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - question
 *               - answer
 *               - folderId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titel der Karte
 *                 example: "JavaScript Closures"
 *               question:
 *                 type: string
 *                 description: Frage auf der Vorderseite
 *                 example: "Was ist ein Closure in JavaScript?"
 *               answer:
 *                 type: string
 *                 description: Antwort auf der Rückseite
 *                 example: "Ein Closure ist eine Funktion, die Zugriff auf Variablen aus ihrem äußeren Scope hat..."
 *               folderId:
 *                 type: string
 *                 format: uuid
 *                 description: ID des zugehörigen Ordners
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags zur Kategorisierung
 *                 example: ["javascript", "closures", "functions"]
 *               currentLearningLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 1
 *                 description: Aktuelles Lernniveau (1-5)
 *     responses:
 *       201:
 *         description: Karte erfolgreich erstellt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     card:
 *                       $ref: '#/components/schemas/Card'
 *       400:
 *         description: Ungültige Eingabedaten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ordner nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', cardController.createCard);

// =============================================================================
// INDIVIDUAL CARD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Einzelne Karte abrufen
 *     description: Lädt eine spezifische Karte anhand ihrer ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Eindeutige ID der Karte
 *     responses:
 *       200:
 *         description: Karte erfolgreich geladen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     card:
 *                       $ref: '#/components/schemas/Card'
 *       404:
 *         description: Karte nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Karte aktualisieren
 *     description: Aktualisiert eine bestehende Karte (partielle Updates möglich)
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Eindeutige ID der Karte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Neuer Titel der Karte
 *               question:
 *                 type: string
 *                 description: Neue Frage
 *               answer:
 *                 type: string
 *                 description: Neue Antwort
 *               folderId:
 *                 type: string
 *                 format: uuid
 *                 description: Neue Ordner-ID
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Neue Tags
 *               currentLearningLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Neues Lernniveau
 *             example:
 *               title: "JavaScript Closures - Erweitert"
 *               currentLearningLevel: 3
 *               tags: ["javascript", "closures", "advanced"]
 *     responses:
 *       200:
 *         description: Karte erfolgreich aktualisiert
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     card:
 *                       $ref: '#/components/schemas/Card'
 *       400:
 *         description: Ungültige Eingabedaten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Karte nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Karte löschen
 *     description: Löscht eine Karte dauerhaft aus dem System
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Eindeutige ID der zu löschenden Karte
 *     responses:
 *       204:
 *         description: Karte erfolgreich gelöscht
 *       404:
 *         description: Karte nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/:id')
    .get(cardController.getCardById)
    .put(cardController.updateCard)
    .delete(cardController.deleteCard);

export default router;