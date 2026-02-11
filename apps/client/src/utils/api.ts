import axios from 'axios';
import ROUTES from './routes';

export const api = axios.create({
  baseURL: ROUTES.SOCKET_URL,
  withCredentials: true
});