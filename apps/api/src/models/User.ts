import mongoose, { Schema, Document } from 'mongoose';
// import { User as IUser, UserRole } from '@clinic-app/shared-types';

import { User as IUser, UserRole } from '../../../../shared-types/src/lib/shared-types';

export interface UserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: Object.values(UserRole), required: true },
  timezone: { type: String, default: 'UTC' }
});

export const User = mongoose.model<UserDocument>('User', UserSchema);