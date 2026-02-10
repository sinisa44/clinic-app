import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer) => {

  console.log('SOCKET SOCKET', process.env.SOCKET_URL)
  io = new Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_URL || "http://localhost:4200",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (userId: string) => {
      socket.join(userId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized. Call initSocket() first.");
  return io;
};
