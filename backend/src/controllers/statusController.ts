import { Request, Response } from 'express';  
import Status from '../models/Status';


const getStatuses = async (req: Request, res: Response) => {
  try {
    const statuses = await Status.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch statuses.' });
  }
}

const createStatus = async (req: Request, res: Response) => {
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
}

const updateStatus = async (req: Request, res: Response) => {
  const { code, description } = req.body;
  if (!code || !description) {
    return res.status(400).json({ message: 'Code and description are required.' });
  }
  try {
    const updatedStatus = await Status.findOneAndUpdate(
      { code }, 
      { description }, 
      { new: true }
    );
    if (!updatedStatus) {
      return res.status(404).json({ message: 'Status not found.' });
    } 
    res.json(updatedStatus);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
}

const deleteStatus = async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const deletedStatus = await Status.findOneAndDelete({ code });
    if (!deletedStatus) {
      return res.status(404).json({ message: 'Status not found.' });
    }
    res.json({ message: 'Status deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete status.' });
  } 
}

export const statusController = {
  getStatuses, 
    createStatus,
    updateStatus,
    deleteStatus
};