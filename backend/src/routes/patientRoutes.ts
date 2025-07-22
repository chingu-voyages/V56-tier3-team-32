import { Router } from 'express';
import {
  createPatient,
  getAllPatients,
  getpatientid
} from '../controllers/patientController';

const router = Router();

router.post('/newPatient', createPatient);
router.get('/patients', getAllPatients);
router.get('/newPatient/generatepid', getpatientid)
export default router;
