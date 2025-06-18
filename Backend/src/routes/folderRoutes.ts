import express from 'express';
import * as folderController from '../controllers/folderController';

const router = express.Router();

// GET /api/folders - Get all folders
router.get('/', folderController.getAllFolders);

// GET /api/folders/:id - Get folder by ID (future implementation)
// router.get('/:id', folderController.getFolderById);

// POST /api/folders - Create new folder (future implementation)
// router.post('/', folderController.createFolder);

// PUT /api/folders/:id - Update folder (future implementation)
// router.put('/:id', folderController.updateFolder);

// DELETE /api/folders/:id - Delete folder (future implementation)
// router.delete('/:id', folderController.deleteFolder);

export default router;