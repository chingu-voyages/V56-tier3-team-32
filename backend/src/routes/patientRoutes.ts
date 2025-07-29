import { Router } from 'express';
import {
  createPatient,
  generateNewPatientId,
  getAllPatients,
  updatePatient,
  searchPatients
} from '../controllers/patientController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/newPatient', requireAdmin,createPatient);
router.get('/patients', requireAdmin, getAllPatients);
router.get('/generate-patient-id', requireAdmin, generateNewPatientId);
router.put("/patients/:patientId", requireAdmin, updatePatient);
router.get("/search",requireAdmin,searchPatients)

export default router;
