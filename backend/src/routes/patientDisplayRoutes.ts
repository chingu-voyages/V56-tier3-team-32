import { getAnonymizedPatients, getPatientByRecentlyChangedStatus } from "../controllers/patientController";
import { getPatientsCountByStatus } from "../controllers/patientController";
import { Router } from 'express';

const router = Router();

router.get("/recents", getPatientByRecentlyChangedStatus);
router.get("/countbystatus", getPatientsCountByStatus);
router.get("/anonymized", getAnonymizedPatients);

export default router;