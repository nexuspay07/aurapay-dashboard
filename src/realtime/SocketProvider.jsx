import {
  createContext,
  useContext,
  useEffect,
} from "react";

import { socket } from "./socket";

const SocketContext =
  createContext(null);

export function SocketProvider({
  children,
}) {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(
    SocketContext
  );
}