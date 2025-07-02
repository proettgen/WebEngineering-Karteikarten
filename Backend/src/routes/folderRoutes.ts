/**
 * Folder Routes
 *
 * Defines REST API endpoints for folder operations including:
 * - CRUD operations for folders
 * - Hierarchical navigation (root folders, child folders)
 * - Folder search functionality
 * - Nested card operations within folder context
 *
 * Base path: /api/folders
 */

import express from 'express';
import * as folderController from '../controllers/folderController';
import * as cardController from '../controllers/cardController';

const router = express.Router();

// =============================================================================
// FOLDER CRUD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/folders:
 *   get:
 *     summary: Alle Ordner mit Paginierung abrufen
 *     description: Lädt alle verfügbaren Ordner mit optionaler Paginierung
 *     tags: [Folders]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Anzahl der Ordner pro Seite
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Anzahl der zu überspringenden Ordner für Paginierung
 *     responses:
 *       200:
 *         description: Liste aller Ordner
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
 *                     folders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Folder'
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
 *   post:
 *     summary: Neuen Ordner erstellen
 *     description: Erstellt einen neuen Ordner (kann auch Unterordner sein)
 *     tags: [Folders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name des Ordners
 *                 example: "JavaScript Grundlagen"
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID des übergeordneten Ordners (optional für Unterordner)
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Ordner erfolgreich erstellt
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
 *                     folder:
 *                       $ref: '#/components/schemas/Folder'
 *       400:
 *         description: Ungültige Eingabedaten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Übergeordneter Ordner nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/')
    .get(folderController.getAllFolders)
    .post(folderController.createFolder);

// =============================================================================
// FOLDER SEARCH & NAVIGATION
// =============================================================================

/**
 * @swagger
 * /api/folders/search:
 *   get:
 *     summary: Ordner nach Name durchsuchen
 *     description: Sucht Ordner basierend auf dem Namen (partielle Übereinstimmung)
 *     tags: [Folders]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Suchbegriff für Ordnername
 *         example: "JavaScript"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Anzahl der Suchergebnisse pro Seite
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Anzahl der zu überspringenden Ergebnisse
 *     responses:
 *       200:
 *         description: Suchergebnisse
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
 *                     folders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Folder'
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
 *         description: Suchbegriff fehlt oder ungültige Parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', folderController.searchFolders);

/**
 * @swagger
 * /api/folders/root:
 *   get:
 *     summary: Alle Hauptordner abrufen
 *     description: Lädt alle Ordner ohne übergeordneten Ordner (Hauptebene)
 *     tags: [Folders]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Anzahl der Ordner pro Seite
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Anzahl der zu überspringenden Ordner
 *     responses:
 *       200:
 *         description: Liste der Hauptordner
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
 *                     folders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Folder'
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
router.get('/root', folderController.getRootFolders);

/**
 * @swagger
 * /api/folders/{id}:
 *   get:
 *     summary: Einzelnen Ordner abrufen
 *     description: Lädt einen spezifischen Ordner anhand seiner ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Eindeutige ID des Ordners
 *     responses:
 *       200:
 *         description: Ordner erfolgreich geladen
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
 *                     folder:
 *                       $ref: '#/components/schemas/Folder'
 *       404:
 *         description: Ordner nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Ordner aktualisieren
 *     description: Aktualisiert einen bestehenden Ordner (partielle Updates möglich)
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Eindeutige ID des Ordners
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Neuer Name des Ordners
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: Neue übergeordnete Ordner-ID
 *                 nullable: true
 *             example:
 *               name: "JavaScript Fortgeschritten"
 *               parentId: null
 *     responses:
 *       200:
 *         description: Ordner erfolgreich aktualisiert
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
 *                     folder:
 *                       $ref: '#/components/schemas/Folder'
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
 *   delete:
 *     summary: Ordner löschen
 *     description: Löscht einen Ordner dauerhaft (kaskadiert zu allen enthaltenen Karten)
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Eindeutige ID des zu löschenden Ordners
 *     responses:
 *       204:
 *         description: Ordner erfolgreich gelöscht
 *       404:
 *         description: Ordner nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/:id')
    .get(folderController.getFolderById)
    .put(folderController.updateFolder)
    .delete(folderController.deleteFolder);

/**
 * @swagger
 * /api/folders/{id}/children:
 *   get:
 *     summary: Unterordner abrufen
 *     description: Lädt alle direkten Unterordner eines spezifischen Ordners
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID des übergeordneten Ordners
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Anzahl der Unterordner pro Seite
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Anzahl der zu überspringenden Unterordner
 *     responses:
 *       200:
 *         description: Liste der Unterordner
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
 *                     folders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Folder'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         limit:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *                         total:
 *                           type: integer
 *       404:
 *         description: Übergeordneter Ordner nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/children', folderController.getChildFolders);

// =============================================================================
// NESTED CARD OPERATIONS (FOLDER CONTEXT)
// =============================================================================

/**
 * @swagger
 * /api/folders/{id}/cards:
 *   get:
 *     summary: Alle Karten in einem Ordner abrufen
 *     description: Lädt alle Karteikarten, die einem spezifischen Ordner zugeordnet sind
 *     tags: [Folders, Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID des Ordners
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
 *         description: Anzahl der zu überspringenden Karten
 *     responses:
 *       200:
 *         description: Liste der Karten im Ordner
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
 *       404:
 *         description: Ordner nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Neue Karte in einem Ordner erstellen
 *     description: Erstellt eine neue Karteikarte und ordnet sie automatisch dem angegebenen Ordner zu
 *     tags: [Folders, Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID des Ordners, dem die Karte zugeordnet wird
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titel der Karte
 *                 example: "React Hooks"
 *               question:
 *                 type: string
 *                 description: Frage auf der Vorderseite
 *                 example: "Was ist der Unterschied zwischen useState und useEffect?"
 *               answer:
 *                 type: string
 *                 description: Antwort auf der Rückseite
 *                 example: "useState verwaltet lokalen State, useEffect führt Seiteneffekte aus..."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags zur Kategorisierung
 *                 example: ["react", "hooks", "frontend"]
 *               currentLearningLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 1
 *                 description: Aktuelles Lernniveau (1-5)
 *     responses:
 *       201:
 *         description: Karte erfolgreich im Ordner erstellt
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
router.get('/:id/cards', cardController.getCardsByFolder);
router.post('/:id/cards', cardController.createCardInFolder);

/**
 * @swagger
 * /api/folders/{id}/cards/{cardId}:
 *   put:
 *     summary: Karte in einem Ordner aktualisieren
 *     description: Aktualisiert eine Karte und validiert, dass sie zum angegebenen Ordner gehört
 *     tags: [Folders, Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID des Ordners
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID der zu aktualisierenden Karte
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
 *               title: "React Hooks - Erweitert"
 *               currentLearningLevel: 3
 *               tags: ["react", "hooks", "advanced"]
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
 *         description: Ungültige Eingabedaten oder Karte gehört nicht zum Ordner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ordner oder Karte nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Karte aus einem Ordner löschen
 *     description: Löscht eine Karte und validiert, dass sie zum angegebenen Ordner gehört
 *     tags: [Folders, Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID des Ordners
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID der zu löschenden Karte
 *     responses:
 *       204:
 *         description: Karte erfolgreich gelöscht
 *       400:
 *         description: Karte gehört nicht zum angegebenen Ordner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ordner oder Karte nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/cards/:cardId', cardController.updateCardInFolder);
router.delete('/:id/cards/:cardId', cardController.deleteCardInFolder);

export default router;