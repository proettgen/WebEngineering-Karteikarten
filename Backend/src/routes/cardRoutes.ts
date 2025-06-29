import express from 'express';
import * as cardController from '../controllers/cardController';

const router = express.Router();

// General card operations (for admin/search across all folders)
router.get('/', cardController.getAllCards);

// Individual card operations (for direct card access)
router
    .route('/:id')
    .get(cardController.getCardById);

export default router;