import express from 'express';
import * as cardController from '../controllers/cardController';

const router = express.Router();

router
    .route('/')
    .get(cardController.getAllCards)
    .post(cardController.createCard);

router
    .route('/:id')
    .get(cardController.getCardById)
    .put(cardController.updateCard)
    .delete(cardController.deleteCard);

export default router;