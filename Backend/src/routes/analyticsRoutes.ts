import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';

const router = Router();

router.get('/', analyticsController.getAnalytics);
router.post('/', analyticsController.createAnalytics);
router.put('/:id', analyticsController.updateAnalytics);
router.delete('/:id', analyticsController.deleteAnalytics);

export default router;
