import { Router } from 'express';
import {
  createPatient,
  generateNewPatientId,
  getAllPatients,
} from '../controllers/patientController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post('/newPatient', createPatient);
router.get('/patients', getAllPatients);
router.get('/generate-patient-id', generateNewPatientId);

export default router;
