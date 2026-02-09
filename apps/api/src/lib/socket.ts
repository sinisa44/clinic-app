import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Initializes a socket.io server with the given http server.
 * @param httpServer - The http server to use for the socket.io server.
 * @returns The initialized socket.io server.
 */
/*******  2236cffb-417d-4a58-8f58-43b0a074144d  *******/
export const initSocket = (httpServer: HttpServer) => {
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
