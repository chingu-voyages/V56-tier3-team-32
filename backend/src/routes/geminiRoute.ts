import { Router } from 'express';
import { geminiRouter } from '../controllers/geminiController';

const router = Router();

router.post('/chat', geminiRouter);

export default router;
