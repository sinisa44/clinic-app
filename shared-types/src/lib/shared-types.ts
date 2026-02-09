export enum UserRole{
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}

export interface User{
  _id: string;
  username: string;
  timezone: string;
  role: UserRole;
}

export interface Event{
  _id:string;
  title:string;
  startTime:string;
  endTIme:string;
  doctorId:string | User;
  patientId:string | User;
}

export interface LoginResponse{
  user: User;
  token: string;
}