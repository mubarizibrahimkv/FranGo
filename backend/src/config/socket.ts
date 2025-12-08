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

    // -----------------------------
    // JOIN CHANNEL (ROOM)
    // -----------------------------
    socket.on("join_channel", (channel) => {
      socket.join(channel);
      console.log("User joined channel:", channel);
    });

    // -----------------------------
    // USER IS VIEWING A CHANNEL
    // -----------------------------
    socket.on("viewing_channel", (channel) => {
      console.log("Viewing channel:", channel);

      userCurrentChannel[socket.id] = channel;

      unreadCounts[channel] = 0;

      io.emit("unread_count_update", { channel, unreadCount: 0 });
    });

    // -----------------------------
    // SEND MESSAGE EVENT
    // -----------------------------
    socket.on("send_message", (data) => {
      const { channel, senderId, message } = data;

      console.log("Sending message:", data);

      io.to(channel).emit("receive_message", {
        channel,
        senderId,
        message,
        timestamp: new Date().toISOString(),
      });

      // -------------------------
      // CHECK IF RECEIVER IS VIEWING THIS CHANNEL
      // -------------------------
      let receiverIsViewing = false;

      for (const id in userCurrentChannel) {
        if (userCurrentChannel[id] === channel) {
          receiverIsViewing = true;
          break;
        }
      }

      // -------------------------
      // HANDLE UNREAD COUNT LOGIC
      // -------------------------
      if (!receiverIsViewing) {
        // increment unread count
        unreadCounts[channel] = (unreadCounts[channel] || 0) + 1;
      } else {
        // reset unread count
        unreadCounts[channel] = 0;
      }

      io.emit("unread_count_update", {
        channel,
        unreadCount: unreadCounts[channel],
      });

      io.emit("conversation_changed");
    });

    // -----------------------------
    // DISCONNECT
    // -----------------------------
    socket.on("disconnect", () => {
      delete userCurrentChannel[socket.id];
      console.log("User disconnected:", socket.id);
    });
  });
};
