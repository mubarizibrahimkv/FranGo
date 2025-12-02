import type React from "react";
import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../../services/messageService";
import type { IChatMessage } from "../../types/common";
import { socket } from "../../utils/socket";

interface chatBoxProp {
  senderId: string;
  receiverId: string;
  userName: string;
  profileImage: string;
}
const ChatBox: React.FC<chatBoxProp> = ({
  senderId,
  receiverId,
  userName,
  profileImage,
}) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [channel, setChannel] = useState("");

  useEffect(() => {
    console.log("chat bax is rendering");
    const getMessages = async () => {
      try {
        const response = await fetchMessages(senderId, receiverId);
        console.log(response.messages, "messages");
        setMessages(response.messages);
        setChannel(response.messages[0].channel);
      } catch (error) {
        console.log("Error in get messages :", error);
      }
    };
    getMessages();
  }, [reload, senderId, , receiverId]);

  useEffect(() => {
    if (!channel) return;
    socket.emit("join_channel", channel);
    console.log("Joined channel:", channel);
  }, [channel]);

  useEffect(() => {
    if (!channel) return;
    socket.emit("viewing_channel", channel);
    console.log("veiewing is rendering");
  }, [channel]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Received:", data);
      console.log("room channel:", channel);

      if (data.channel !== channel) return;

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [channel]);

  const handleMessage = async () => {
    if (!message.trim()) return;
    try {
      const response = await sendMessage(
        channel,
        message,
        senderId,
        "company",
        receiverId
      );
      if (response.success) {
        socket.emit("send_message", {
          channel,
          senderId,
          message,
        });

        setReload((prev) => !prev);
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message :", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-2/3 bg-white rounded-xl shadow flex flex-col max-h-[83vh]">
      <div className="flex items-center gap-4 p-4 border-b">
        <img src={profileImage} className="w-12 h-12 rounded-full" />
        <h2 className="text-lg font-semibold">{userName}</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === senderId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs flex flex-col ${
                msg.senderId === senderId
                  ? "bg-[#1F3C58] text-white rounded-br-none"
                  : "bg-[#eaeaea] text-black rounded-bl-none"
              }`}
            >
              {/* Message Text */}
              <span>{msg.message}</span>

              {/* Timestamp below the message */}
              {msg.createdAt && (
                <span className="text-xs text-gray-400 mt-1 self-end">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex items-center gap-3">
        <button className="p-2 rounded-lg">📎</button>

        <input
          type="text"
          placeholder="Write Message"
          value={message}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-lg outline-none"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleMessage();
            }
          }}
        />

        <button
          onClick={handleMessage}
          className="w-12 h-12 bg-[#0c4a5b] rounded-full flex items-center justify-center text-white text-lg"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
