import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

import socketConnection from '../utils/socket';
import { format } from 'date-fns';
import ROUTES from '../utils/routes';

export const PatientDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const fetchEvents = () =>
    api.get(ROUTES.EVENTS.GET).then((res) => setEvents(res.data));

  useEffect(() => {
    fetchEvents();

    // WS Listeners
    socketConnection.on('event-created', () => {
      console.log('event-created!!!!!!!!!!!!');
      fetchEvents();
      setNotifications((prev) => [...prev, 'New event added by doctor!']);
    });

    socketConnection.on('notification', (data: any) => {
      setNotifications((prev) => [...prev, data.message]);
      alert(data.message);
    });

    return () => {
      socketConnection.off('event-created');
      socketConnection.off('notification');
    };
  }, []);

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <h1>My Appointments</h1>

      {notifications.length > 0 && (
        <div
          style={{
            border: '1px solid orange',
            padding: 10,
            marginBottom: 20,
            background: '#fff3e0',
          }}
        >
          <h4>Notifications:</h4>
          <ul>
            {notifications.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
          <button onClick={() => setNotifications([])}>Clear</button>
        </div>
      )}

      {events.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {events.map((ev) => (
            <li
              key={ev._id}
              style={{ borderBottom: '1px solid #eee', padding: 15 }}
            >
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>{ev.title}</div>
              <div>
                {/* Prikaz vremena u lokalnoj zoni pacijenta (browser default) */}
                Start: {format(new Date(ev.startTime), 'dd.MM.yyyy HH:mm')}{' '}
                <br />
                End: {format(new Date(ev.endTime), 'HH:mm')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
