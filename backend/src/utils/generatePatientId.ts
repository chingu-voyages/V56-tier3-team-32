import { Patient } from '../models/patientModel';
import crypto from 'crypto'; // Importing crypto for secure random generation

export const generatePatientId = async (): Promise<string> => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const generate = (): string => {
    return Array.from(crypto.randomFillSync(new Uint8Array(6)))
      .map((x) => charset[x % charset.length])
      .join('');
  };
  let patientId: string;
  let exists = true;

  // loop until the generated patientId is unique
  do {
    patientId = generate();
    const existing = await Patient.findOne({ patientId });
    exists = !!existing;
  } while (exists);

  return patientId;
};
