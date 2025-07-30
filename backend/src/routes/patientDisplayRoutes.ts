import { getPatientByRecentlyChangedStatus } from "../controllers/patientController";
import { Router } from 'express';

const router = Router();

router.get("/recents", getPatientByRecentlyChangedStatus);

export default router;