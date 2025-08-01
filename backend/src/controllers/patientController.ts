import { Request, Response } from 'express';
import { Patient } from '../models/patientModel';
import { generatePatientId } from '../utils/generatePatientId';
import Status from '../models/statusModel';

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
    if(req.body.patientId!=6) return res.status(400).json({ message: 'Failed to create patient'})
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

export const updatePatient = async (
  req:Request,
  res:Response
):Promise<Response> =>{
  try {
    const patientToUpdate = {
      ...req.body.updatePatient, patientId: req.params.patientId
    };
    const result = await Patient.findOneAndUpdate(
      { patientId: req.params.patientId },
      { $set: { ...patientToUpdate } },
      { new: true, runValidators: true }
    );
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error updating patient:', error);
    return res
      .status(500)
      .json({ message: 'Failed to update patient', error: error.message });
  }
}

export const getPatientByRecentlyChangedStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Fetch the 6 most recently created or updated patients
    const patients = await Patient.find()
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(6)
      .populate({ path: 'status', select: 'code -_id' });

    return res.status(200).json(patients.map(patient => ({
      patientId: patient.patientId,
      status: patient.status,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt
    })));
  } catch (error: any) {
    console.error('Error fetching recent patients:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch recent patients', error: error.message });
  }
};

export const updatePatientStatus = async (
  req: Request,
  res: Response
  ): Promise<Response> => {
  try {
    const { patientId } = req.params;
    const { statusId } = req.body;

    if (!patientId || !statusId) {
      return res.status(400).json({ message: 'Missing patient ID or Status ID' });
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId },
      { $set: { status: statusId } },
      { new: true, runValidators: true }
    ).populate({
      path: 'status',
      select: 'code -_id',
    });

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json(updatedPatient);
  } catch (error: any) {
    console.error('Error updating patient status:', error);
    return res
      .status(500)
      .json({ message: 'Failed to update patient status', error: error.message });
  }
};

export const getPatientsByStatus= async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { statusId } = req.params;

    if (!statusId) {
      return res.status(400).json({ message: 'Status ID is required' });
    }

    const patients = await Patient.find({ status: statusId }).populate({
      path: 'status',
      select: 'code -_id',
    });

    return res.status(200).json(patients);
  } catch (error: any) {
    console.error('Error fetching patients by status:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch patients by status', error: error.message });
  }
};

export const getPatientsCountByStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const statuses = await Status.find();
    const counts = await Promise.all(
      statuses.map(async (status: any) => {
        const count = await Patient.countDocuments({ status: status._id });
        return { status: status.code, count };
      })
    );

    return res.status(200).json(counts);
  } catch (error: any) {
    console.error('Error fetching patients count by status:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch patients count by status', error: error.message });
  }
};


