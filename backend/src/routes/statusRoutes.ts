import express from 'express';
import { statusController } from '../controllers/statusController';
import { authenticate, requireAdminOrSurgeryTeamRole } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);
router.use(requireAdminOrSurgeryTeamRole);

router.get('/',statusController.getStatuses);
router.post('/', statusController.createStatus);
router.put('/',statusController.updateStatus);
router.delete('/:code',statusController.deleteStatus);

export default router;