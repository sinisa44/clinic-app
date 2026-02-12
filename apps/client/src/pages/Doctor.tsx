import React, { useState, useEffect } from 'react';

import { api } from '../utils/api';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  addMonths,
  parseISO,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

import ROUTES from '../utils/routes';

export const DoctorDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [patients, setPatients] = useState<any[]>([]);

  const [isBatch, setIsBatch] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    patientId: '',
    time: '12:00',
    startDate:'',
    endDate: '',
  });

  const fetchEvents = () =>
    api.get(ROUTES.EVENTS.GET).then((res) => setEvents(res.data));
  const fetchPatients = () =>
    api.get( ROUTES.USERS.GET_PATIENTS).then((res) => setPatients(res.data));

  useEffect(() => {
    fetchEvents();
    fetchPatients();
  }, []);

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setIsBatch(false);
  };

  const handleBatchClick = () => {
    setSelectedDay(new Date()); // Default to today for start
    setIsBatch(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    // console.log(formData);

    // return
    try {
      if (isBatch) {
        await api.post(ROUTES.EVENTS.CREATE_BATCH, {
          title: formData.title,
          patientId: formData.patientId,
          time: formData.time,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
      } else {
        const dateTimeStr = `${format(selectedDay, 'yyyy-MM-dd')}T${formData.time}:00`;
        const localDate = new Date(dateTimeStr);

        await api.post(ROUTES.EVENTS.CREATE_EVENT, {
          title: formData.title,
          patientId: formData.patientId,
          startTime: localDate.toISOString(),
        });
      }
      // fetchEvents();
      alert('Success');
      setSelectedDay(null);
    } catch (err) {
      alert('Error creating events');
    }
  };


  const monthStart = startOfMonth(currentDate);
  const monthEnd = addMonths(monthStart, 3); // 3 meseca
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  const dayKeyLocal = (d: Date) => format(d, 'yyyy-MM-dd');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Levi deo: Kalendar */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Doctor Calendar</h2>
          <button onClick={handleBatchClick}>Add Batch Events</button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 5,
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} style={{ fontWeight: 'bold' }}>
              {d}
            </div>
          ))}
          {days.map((day) => {
            const hasEvent = events.some(
              (ev) => dayKeyLocal(new Date(ev.startTime)) === dayKeyLocal(day),
            );

            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                style={{
                  border: '1px solid #ccc',
                  height: 80,
                  padding: 5,
                  cursor: 'pointer',
                  backgroundColor: hasEvent ? '#e6f7ff' : 'white',
                  borderColor: isSameDay(day, selectedDay || new Date(0))
                    ? 'blue'
                    : '#ccc',
                }}
              >
                {format(day, 'd MMM')}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div
          style={{
            width: 400,
            borderLeft: '2px solid #333',
            padding: 20,
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>
            {isBatch
              ? 'Batch Schedule'
              : `Schedule for ${format(selectedDay, 'dd.MM.yyyy')}`}
          </h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <label>Patient:</label>
            <select
              required
              onChange={(e) =>
                setFormData({ ...formData, patientId: e.target.value })
              }
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.username}
                </option>
              ))}
            </select>

            <label>Title:</label>
            <input
              required
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <label>Time:</label>
            <input
              required
              type="time"
              defaultValue="12:00"
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />

            {isBatch && (
              <>
               <label>StartDate:</label>
                <input
                  required
                  type="date"
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              
                <label>End Date:</label>
                <input
                  required
                  type="date"
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
                <p style={{ fontSize: 12, color: '#666' }}>
                  Events will be created for every day from{' '}
                  {format(selectedDay, 'dd.MM')} to selected end date at the
                  chosen time.
                </p>
              </>
            )}

            <button type="submit" style={{ marginTop: 20, padding: 10 }}>
              Save Event(s)
            </button>
            <button type="button" onClick={() => setSelectedDay(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
