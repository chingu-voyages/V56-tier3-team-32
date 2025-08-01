import { getPatientByRecentlyChangedStatus } from "../controllers/patientController";
import { getPatientsCountByStatus } from "../controllers/patientController";
import { Router } from 'express';

const router = Router();

router.get("/recents", getPatientByRecentlyChangedStatus);
router.get("/countbystatus", getPatientsCountByStatus);

export default router;