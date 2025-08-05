import { Router } from 'express';
import { geminiRouter } from '../controllers/gemini';

const router = Router();

router.post('/chat', geminiRouter);

export default router;
