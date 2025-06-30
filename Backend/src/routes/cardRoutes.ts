import express from 'express';
import * as cardController from '../controllers/cardController';

const router = express.Router();

// General card operations (for admin/search across all folders)
router.get('/', cardController.getAllCards);
router.post('/', cardController.createCard);

// Individual card operations (for direct card access)
router
    .route('/:id')
    .get(cardController.getCardById)
    .put(cardController.updateCard)
    .delete(cardController.deleteCard);

export default router;