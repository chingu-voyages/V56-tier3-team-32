import express from 'express';
import { statusController } from '../controllers/statusController';
import { authenticate, requireAdminOrSurgeryTeamRole, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.get('/', requireAdminOrSurgeryTeamRole, statusController.getStatuses);

router.post('/', requireAdmin, statusController.createStatus);
router.put('/', requireAdmin, statusController.updateStatus);
router.delete('/:code', requireAdmin, statusController.deleteStatus);

export default router;