import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "../logger";

export let io: Server;

export const setupSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const userCurrentChannel: Record<string, string> = {};
  const unreadCounts: Record<string, number> = {};

  io.on("connection", (socket) => {
    logger.info("User connected:", socket.id);

    socket.on("join_room", (userId: string) => {
      socket.join(userId);
      console.log("✅ User joined notification room:", userId);
    });

    socket.on("join_channel", (channel) => {
      socket.join(channel);
    });

    // -----------------------------
    // USER IS VIEWING A CHANNEL
    // -----------------------------
    socket.on("viewing_channel", (channel) => {
      userCurrentChannel[socket.id] = channel;
      unreadCounts[channel] = 0;

      io.emit("unread_count_update", {
        channel,
        unreadCount: 0,
      });
    });

    
    socket.on("send_message", (data) => {
      const { channel, senderId, message } = data;

      io.to(channel).emit("receive_message", {
        channel,
        senderId,
        message,
        timestamp: new Date().toISOString(),
      });

      let receiverIsViewing = false;

      for (const id in userCurrentChannel) {
        if (userCurrentChannel[id] === channel) {
          receiverIsViewing = true;
          break;
        }
      }

      unreadCounts[channel] = receiverIsViewing
        ? 0
        : (unreadCounts[channel] || 0) + 1;

      io.emit("unread_count_update", {
        channel,
        unreadCount: unreadCounts[channel],
      });

      io.emit("conversation_changed");
    });


    socket.on("disconnect", () => {
      delete userCurrentChannel[socket.id];
      console.log("User disconnected:", socket.id);
    });
  });
};
