import { io } from "socket.io-client";

const SOCKET_URL =
  "https://aurapay-backend-qfg0.onrender.com";

export const socket = io(
  SOCKET_URL,
  {
    autoConnect: false,

    transports: [
      "websocket",
      "polling",
    ],
  }
);