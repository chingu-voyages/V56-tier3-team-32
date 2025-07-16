import { Router } from 'express';
import {
  createPatient,
  getAllPatients,
} from '../controllers/patientController';

const router = Router();

router.post('/newPatient', createPatient);
router.get('/patients', getAllPatients);
export default router;
