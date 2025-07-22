import { Router } from 'express';
import {
  createPatient,
  generateNewPatientId,
  getAllPatients,
} from '../controllers/patientController';

const router = Router();

router.post('/newPatient', createPatient);
router.get('/patients', getAllPatients);
router.get('/generate-patient-id', generateNewPatientId);

export default router;
