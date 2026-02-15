import React, { createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { socket } from "./socket";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user.isAuthenticated) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join_room", user._id);
    });

    return () => {
      socket.disconnect();
      console.log(" Socket disconnected");
    };
  }, [user.isAuthenticated, user._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
