import express from 'express';
import { statusController } from '../controllers/statusController';

const router = express.Router();


router.get('/',statusController.getStatuses);
router.post('/', statusController.createStatus);
router.put('/',statusController.updateStatus);
router.delete('/:code',statusController.deleteStatus);

export default router;