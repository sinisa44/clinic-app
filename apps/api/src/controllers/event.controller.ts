import {Request, Response} from 'express';
import { EventModel } from '../models/Event';
import * as EventService from '../services/event.service';
import { getIO } from "../lib/socket";

export const getEvents = async(req:Request, res:Response) => {
    const user = (req.session as any).user;
  if (!user) return res.status(401).send('Unauthorized');

  let query = {};
  if (user.role === 'doctor') {

    query = {};
  } else {

    query = { patientId: user._id };
  }

  const events = await EventModel.find(query)
    .populate('patientId', 'username')
    .sort({ startTime: 1 });
  res.json(events);
}

export const createEvent = async(req:Request, res:Response) => {
     const user = (req.session as any).user;
  if (!user || user.role !== 'doctor') return res.status(403).send('Forbidden');

  try {
    const event = await EventService.createEvent(req.body, user);
    
    // WS Notifikacija pacijentu da re-fetchuje
    const patientRoom = req.body.patientId;
    // io.to(patientRoom).emit('event-created', event);
    getIO().to(patientRoom).emit("event-created", event);


    res.json(event);
  } catch (e) {
    res.status(500).json(e);
  }
}

export const createBatchEvents = async(req:Request, res:Response) => {
    const user = (req.session as any).user;
  if (!user || user.role !== 'doctor') return res.status(403).send('Forbidden');

  const { patientId, title, startDate, endDate, time } = req.body;

  try {
    const events = await EventService.createBatchEvents({
     doctorId: user._id,
      patientId,
      title,
      startDateStr:startDate,
      endDateStr:endDate,
      timeStr:time,
      doctorTimezone:user.timezone,
  });

    // WS Notifikacija
    // io.to(patientId).emit('event-created', events);
    getIO().to(patientId).emit("event-created", events);

    res.json(events);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error creating batch events');
  }
}