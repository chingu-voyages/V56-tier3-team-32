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

// POST /api/statuses
router.post('/', async (req: Request, res: Response) => {
  const { code, description } = req.body;

  if (!code || !description) {
    return res.status(400).json({ message: 'Code and description are required.' });
  }

  try {
    const newStatus = new Status({ code, description });
    await newStatus.save();
    res.status(201).json(newStatus);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create status.' });
  }
});

export default router;

