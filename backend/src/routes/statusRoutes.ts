import express from 'express';
import { statusController } from '../controllers/statusController';
import { authenticate, requireAdminOrSurgeryTeam, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.get('/', requireAdminOrSurgeryTeam, statusController.getStatuses);

router.put('/duration', requireAdmin, statusController.updateStatusDuration);
router.post('/', requireAdmin, statusController.createStatus);
router.put('/', requireAdmin, statusController.updateStatus);
router.delete('/:code', requireAdmin, statusController.deleteStatus);

export default router;