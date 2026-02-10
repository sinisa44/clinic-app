import {Types} from 'mongoose';

export enum UserRole{
  DOCTOR = 'doctor',
  PATIENT = 'patient'
}

export interface User{
  _id: string;
  username: string;
  timezone: string;
  password?:string;
  role: UserRole;
}

export interface Event{
  _id:string;
  title:string;
  startTime:string;
  endTime:string;
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
}

export interface LoginResponse{
  user: User;
  token: string;
}