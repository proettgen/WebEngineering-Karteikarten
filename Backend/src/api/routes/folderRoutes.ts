import express from 'express';
import * as folderController from '../../controllers/folderController.js';

const router = express.Router();

router.get('/', folderController.getAllFolders);

// Example for a future route:
// router.get('/:id', folderController.getFolderById);

export default router;