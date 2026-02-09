import { EventModel } from "../models/Event";
import {addDays, set, parseISO, addMinutes} from 'date-fns';
import {toDate} from 'date-fns-tz';
import { Event } from "@clinic-app/shared-types";

type batchEventParams = {
     doctorId: string,
    patientId: string,
    title: string,
    startDateStr: string,
    endDateStr: string,
    timeStr: string, 
    doctorTimezone: string
}
export const createEvent = async (eventData: Event) => {
    const start = new Date(eventData.startTime)
    const end = addMinutes(start, 30)


    const event = new EventModel({
        ...eventData,
        startTime: start,
        endTime: end
    })

    const newEvent = await event.save();

    return newEvent
}

export const createBatchEvents = async( data: batchEventParams ) => {
    const {doctorId,patientId,title,startDateStr,endDateStr,timeStr, doctorTimezone } = data
    
    const [hours, minutes] = timeStr.split(':').map(Number);

    let currentDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const createdEvents = [];

   while (currentDate <= endDate) {
    // Kreiramo datum u vremenskoj zoni doktora
    const dateInDoctorTz = set(currentDate, { hours, minutes, seconds: 0, milliseconds: 0 });
    
    // Konvertujemo taj lokalni datum doktora u UTC datum za bazu
    // Koristimo toDate iz date-fns-tz da kreiramo Date objekat koji predstavlja taj trenutak u toj zoni
    const utcDate = toDate(dateInDoctorTz, { timeZone: doctorTimezone });
    
    const event = new EventModel({
      title,
      doctorId,
      patientId,
      startTime: utcDate,
      endTime: addMinutes(utcDate, 30)
    });

    createdEvents.push(event);
    currentDate = addDays(currentDate, 1);
  }

  return await EventModel.insertMany(createdEvents);

}