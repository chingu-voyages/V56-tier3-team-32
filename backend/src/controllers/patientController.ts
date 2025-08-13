import { Request, Response } from 'express';
import { Patient } from '../models/patientModel';
import { generatePatientId } from '../utils/generatePatientId';
import Status from '../models/statusModel';
const CHECKED_IN_STATUS_ID = '6876b51b6e7ee884eb6b67c3';

// Helper function to calculate status duration
const calculateStatusDuration = (statusStartTime: Date, updatedAt: Date): string => {
  const startTime = statusStartTime || updatedAt;
  const now = new Date();
  const minutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

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
    if (req.body.patientId.length !== 6)
      return res
        .status(400)
        .json({ message: 'Patient ID must be exactly 6 characters long' });
    const patientId = req.body.patientId || (await generatePatientId());
    const newPatient = await Patient.create({
      ...req.body,
      patientId,
      status: CHECKED_IN_STATUS_ID,
      statusStartTime: new Date(),
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
    
    // Add duration to each patient
    const patientsWithDuration = patients.map(patient => ({
      ...patient.toObject(),
      statusDuration: calculateStatusDuration(patient.statusStartTime, patient.updatedAt)
    }));
    
    return res.status(200).json(patientsWithDuration);
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch patients', error: error.message });
  }
};

export const updatePatient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const patientToUpdate = {
      ...req.body.updatePatient,
      patientId: req.params.patientId,
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
};

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

    return res.status(200).json(
      patients.map((patient) => ({
        patientId: patient.patientId,
        status: patient.status,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      }))
    );
  } catch (error: any) {
    console.error('Error fetching recent patients:', error);
    return res.status(500).json({
      message: 'Failed to fetch recent patients',
      error: error.message,
    });
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
      return res
        .status(400)
        .json({ message: 'Missing patient ID or Status ID' });
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId },
      { $set: { status: statusId, statusStartTime: new Date() } },
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
    return res.status(500).json({
      message: 'Failed to update patient status',
      error: error.message,
    });
  }
};

export const searchPatients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if(req.query.lastName=== undefined || req.query.lastName ===''|| req.query.lastName ==='null') {
    return res.redirect('./patients');
    }
    const patients = await Patient.find({ lastName: {$regex:'^'+req.query.lastName, $options:'i'} }).populate({
      path: 'status',
      select: 'code -_id',
    });
    
    // Add duration to each patient
    const patientsWithDuration = patients.map(patient => ({
      ...patient.toObject(),
      statusDuration: calculateStatusDuration(patient.statusStartTime, patient.updatedAt)
    }));
    
     res.status(200).json(patientsWithDuration);
  } catch (error: any) {
    console.error('Error searching patient:', error);
     res
      .status(500)
      .json({ message: 'Failed to search patient', error: error.message });
  }
};
export const getPatientsByStatus = async (
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
    return res.status(500).json({
      message: 'Failed to fetch patients by status',
      error: error.message,
    });
  }
};

export const getPatientsCountByStatus = async (
  _req: unknown,
  res: Response
): Promise<Response> => {
  try {
    const statuses = await Status.find();
    const counts = await Promise.all(
      statuses.map(async (status) => {
        const count = await Patient.countDocuments({ status: status._id });
        return { status: status.code, count };
      })
    );

    return res.status(200).json(counts);
  } catch (error: any) {
    console.error('Error fetching patients count by status:', error);
    return res.status(500).json({
      message: 'Failed to fetch patients count by status',
      error: error.message,
    });
  }
};

export const getAnonymizedPatients = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const patients = await Patient.find()
      .populate({ path: 'status', select: 'code -_id' })
      .select('patientId status createdAt updatedAt');
    const anonymizedPatients = patients.map((patient: any) => ({
      patientId: patient.patientId,
      statusCode: patient.status?.code,
      updatedAt: patient.updatedAt,
    }));
    return res.status(200).json(anonymizedPatients);
  } catch (error: any) {
    console.error('Error fetching anonymized patients:', error);
    return res.status(500).json({
      message: 'Failed to fetch anonymized patients',
      error: error.message,
    });
  }
};
