import { useEffect, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { socket } from "../../utils/socket";
import { sendMessage } from "../../services/messageService";
import type { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";

const ChatModal = ({
  isOpen,
  onClose,
  companyName,
  ids,
}: {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  ids: { senderId: string; recieverId: string };
}) => {
  const [message, setMessage] = useState("");
  const channel = [ids.senderId, ids.recieverId].sort().join("_");
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!channel) return;
    if (!isOpen) return;
    socket.emit("join_channel", channel);
    console.log("Joined channel:", channel);
  }, [channel, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleQuickMessage = async () => {
    try {
      const response = await sendMessage(
        "",
        message,
        ids.senderId,
        user.role,
        ids.recieverId,
      );
      if (response.success) {
        onClose();
        socket.emit("send_message", {
          channel,
          senderId: ids.senderId,
          message,
        });
      }
    } catch (error) {
      console.error("Error sending message :", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5 animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          <IoClose />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Message to: <span className="text-[#0C2340]">{companyName}</span>
        </h2>

        <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 outline-none bg-transparent text-sm"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="text-[#0C2340] hover:text-[#092032] text-lg"
            onClick={handleQuickMessage}
          >
            <IoSendSharp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
