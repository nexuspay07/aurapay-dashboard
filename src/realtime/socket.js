import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "";

export const socket = SOCKET_URL
  ? io(
      SOCKET_URL,
      {
        autoConnect: false,

        transports: [
          "websocket",
          "polling",
        ],
      }
    )
  : null;
