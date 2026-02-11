import express from 'express';
import http from 'http';
// import mongoose from 'mongoose';
import { Server } from 'socket.io';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectToMongo } from './lib/database';
import redisClient from './lib/redits';
import { initSocket } from './lib/socket';

import { startNotificationScheduler } from './services/notification.service';

import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = initSocket(server);
startNotificationScheduler(io);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'supersecretclinic',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  connectToMongo();
});
