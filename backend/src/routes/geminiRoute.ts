import { Router } from 'express';
import { geminiRouter, testApiKey } from '../controllers/gemini';

const router = Router();

router.post('/chat', geminiRouter);
router.get('/test', testApiKey);

export default router;
