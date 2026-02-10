import React, { useEffect, useState, JSX } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { Login } from '../pages/Login';
import { DoctorDashboard } from '../pages/Doctor';
import { PatientDashboard } from '../pages/Patient';
import { UserRole } from '@clinic-app/shared-types';
import io from 'socket.io-client';


export const socket = io('http://localhost:3333', {
  withCredentials: true, 
  transports: ['websocket'] 
});


const ProtectedRoute = ({ children, role }: { children: JSX.Element, role?: UserRole }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    api.get('/auth/me').then(res => {
      setUser(res.data.user);
      // Povezivanje na socket room
      socket.emit('join-room', res.data.user._id);
    }).catch(() => {
      setUser(null);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    if (location.pathname.startsWith('/clinic')) return <Navigate to="/clinic/login" />;
    if (location.pathname.startsWith('/patient')) return <Navigate to="/patient/login" />;
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    return <div>Access Denied</div>;
  }

  return children;
};

export function App() {
  return (
    <Routes>
      <Route path="/clinic/login" element={<Login role={UserRole.DOCTOR} />} />
      <Route path="/patient/login" element={<Login role={UserRole.PATIENT} />} />
      
      <Route path="/clinic" element={
        <ProtectedRoute role={UserRole.DOCTOR}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/patient" element={
        <ProtectedRoute role={UserRole.PATIENT}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/clinic/login" />} />
    </Routes>
  );
}
export default App;