import { Router } from 'express';
import {
  createPatient,
  generateNewPatientId,
  getAllPatients,
  updatePatient,
  searchPatients,
  updatePatientStatus,
} from '../controllers/patientController';
import { authenticate, requireAdmin, requireAdminOrSurgeryTeam } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/newPatient', requireAdmin,createPatient);
router.get('/patients', requireAdminOrSurgeryTeam, getAllPatients);
router.get('/generate-patient-id', requireAdmin, generateNewPatientId);
router.put("/patients/:patientId", requireAdmin, updatePatient);
router.get("/search",requireAdminOrSurgeryTeam,searchPatients)
router.patch("/patients/:patientId/status", requireAdminOrSurgeryTeam, updatePatientStatus);

export default router;
