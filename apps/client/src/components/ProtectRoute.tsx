import { useEffect, useState , JSX} from 'react';
import { UserRole } from '@clinic-app/shared-types';
import { useLocation, Navigate } from 'react-router-dom';
import { api } from '../utils/api';
import socketConnection from '../utils/socket';

const ProtectedRoute = ({ children, role }: { children: JSX.Element, role?: UserRole }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    api.get('/auth/me').then(res => {
      setUser(res.data.user);
      socketConnection.emit('join-room', res.data.user._id);
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

export default ProtectedRoute;