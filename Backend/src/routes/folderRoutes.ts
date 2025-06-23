import express from 'express';
import * as folderController from '../controllers/folderController';

const router = express.Router();

router
    .route('/')
    .get(folderController.getAllFolders)
    .post(folderController.createFolder);

router
    .route('/:id')
    .get(folderController.getFolderById)
    .put(folderController.updateFolder)
    .delete(folderController.deleteFolder);

export default router;