import { Request, Response } from 'express';
import { Patient } from '../models/patientModel';
import { generatePatientId } from '../utils/generatePatientId';

const CHECKED_IN_STATUS_ID = '6876b51b6e7ee884eb6b67c3';

export const generateNewPatientId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const patientId = await generatePatientId();
    return res.status(200).json({ patientId });
  } catch (error: any) {
    console.error('Error generating patient ID:', error);
    return res
      .status(500)
      .json({ message: 'Failed to generate patient ID', error: error.message });
  }
};

export const createPatient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const patientId = req.body.patientId || (await generatePatientId());
    const newPatient = await Patient.create({
      ...req.body,
      patientId,
      status: CHECKED_IN_STATUS_ID,
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
    const patients = await Patient.find().populate({
      path: 'status',
      select: 'code -_id',
    });
    return res.status(200).json(patients);
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch patients', error: error.message });
  }
};


export const updatePatient= async (
  req:Request,
  res:Response
):Promise<Response> =>{
  try {
    const newPatient = await Patient.findOneAndUpdate({patientId:req.params.patientId},{ $set:{...req.body} });
    return res.status(201).json(newPatient);
  } catch (error: any) {
    console.error('Error update patient:', error);
    return res
      .status(500)
      .json({ message: 'Failed to update patient', error: error.message });
  }
}