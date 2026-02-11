import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {api} from '../utils/api';
import { UserRole } from '@clinic-app/shared-types';

export const Login = ({ role }: { role: UserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    try {
      await api.post('/auth/login', { username, password, timezone });
      if (role === UserRole.DOCTOR) navigate('/clinic');
      else navigate('/patient');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{role === UserRole.DOCTOR ? 'Doctor' : 'Patient'} Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};