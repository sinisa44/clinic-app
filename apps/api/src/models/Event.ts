import mongoose, { Schema, Document, mongo } from 'mongoose';
// import { Event as IEvent } from '@clinic-app/shared-types';

import { Event as IEvent } from '../../../../shared-types/src/lib/shared-types';

export interface EventDocument
  extends Omit<IEvent, '_id' | 'startTime' | 'endTime'>,
    Document {
  startTime: Date;
  endTime: Date;
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
