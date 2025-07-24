import { Router } from 'express';
import {
  createPatient,
  generateNewPatientId,
  getAllPatients,
  updatePatientForm,
  updatePatient
} from '../controllers/patientController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/newPatient', requireAdmin,createPatient);
router.get('/patients', requireAdmin, getAllPatients);
router.get('/generate-patient-id', requireAdmin, generateNewPatientId);
// update patient info
router.route("/editPatientInfo/:patientId")
.get(updatePatientForm)
.put(updatePatient)

export default router;
