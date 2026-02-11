import { EventModel } from '../models/Event';
import { User } from '../models/User';
import { Server } from 'socket.io';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export const startNotificationScheduler = (io: Server) => {
  // Provera svakih 30 sekundi
  setInterval(async () => {
    const now = new Date();
  
    const targetTimeStart = addMinutes(now, 5); 
    const targetTimeEnd = addMinutes(now, 5.5);

    const events = await EventModel.find({
      startTime: {
        $gte: targetTimeStart,
        $lte: targetTimeEnd
      }
    }).populate('patientId');

    for (const event of events) {
      const patient = event.patientId as any;
      if (patient) {
    
        // Formatiramo vreme kako ga pacijent vidi
        const patientLocalTime = formatInTimeZone(event.startTime, patient.timezone, 'yyyy-MM-dd HH:mm:ssXXX');
        
        console.log(`[NOTIFICATION SIMULATION] Reminder for ${patient.username}: Event "${event.title}" starts at ${patientLocalTime} (${patient.timezone})`);

        // Slanje preko socketa ako je pacijent konektovan
        // Emitujemo direktno u room koji je ID pacijenta
        io.to(patient._id.toString()).emit('notification', {
          message: `Reminder: Event "${event.title}" starts in 5 minutes!`,
          eventTitle: event.title,
          startTime: event.startTime
        });
      }
    }
  }, 30 * 1000); 
};