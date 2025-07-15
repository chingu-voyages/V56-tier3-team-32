import express, { Request, Response } from 'express';
import Status from '../models/Status';

const router = express.Router();

// GET /api/statuses
router.get('/', async (_req: Request, res: Response) => {
  try {
    const statuses = await Status.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch statuses.' });
  }
});

export default router;

