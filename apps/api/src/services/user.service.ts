import { User } from '../models/User';

export const getPatients = async () => {
  const patients = await User.find({ role: 'patient' }).select('-password');

  return patients;
};
