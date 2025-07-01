import express from 'express';
import * as folderController from '../controllers/folderController';
import * as cardController from '../controllers/cardController';

const router = express.Router();

router
    .route('/')
    .get(folderController.getAllFolders)
    .post(folderController.createFolder);

// Search folders
router.get('/search', folderController.searchFolders);

// Hierarchical folder routes
router.get('/root', folderController.getRootFolders);
router.get('/:id/children', folderController.getChildFolders);

// Cards for a specific folder - all card operations within folder context
router.get('/:id/cards', cardController.getCardsByFolder);
router.post('/:id/cards', cardController.createCardInFolder);
router.put('/:id/cards/:cardId', cardController.updateCardInFolder);
router.delete('/:id/cards/:cardId', cardController.deleteCardInFolder);

router
    .route('/:id')
    .get(folderController.getFolderById)
    .put(folderController.updateFolder)
    .delete(folderController.deleteFolder);

export default router;