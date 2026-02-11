import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { Login } from '../pages/Login';
import { DoctorDashboard } from '../pages/Doctor';
import { PatientDashboard } from '../pages/Patient';
import { UserRole } from '@clinic-app/shared-types';

import { Home } from '../pages/Home';
import ProtectedRoute from '../components/ProtectRoute';

export function App() {
  return (
    <Routes>
      <Route path="/clinic/login" element={<Login role={UserRole.DOCTOR} />} />
      <Route
        path="/patient/login"
        element={<Login role={UserRole.PATIENT} />}
      />
      <Route path="/home" element={<Home />} />

      <Route
        path="/clinic"
        element={
          <ProtectedRoute role={UserRole.DOCTOR}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient"
        element={
          <ProtectedRoute role={UserRole.PATIENT}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
}
export default App;
