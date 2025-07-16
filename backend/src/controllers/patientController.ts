import { Request, Response } from 'express';
import { Patient } from '../models/patientModel';
import { generatePatientId } from '../utils/generatePatientId';

export const createPatient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const patientId = await generatePatientId();

    const newPatient = await Patient.create({
      ...req.body,
      patientId: patientId,
    });
    return res.status(201).json(newPatient);
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return res
      .status(500)
      .json({ message: 'Failed to create patient', error: error.message });
  }
};

export const getAllPatients = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const patients = await Patient.find();
    return res.status(200).json(patients);
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch patients', error: error.message });
  }
};
