import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { getConversation } from "../../services/messageService";
import { formatChatTimestamp } from "../../utils/formatTimeStamp";
import ChatBox from "../../components/CommonComponents/ChatBox";
import Navbar from "../../components/InvestorComponents/Navbar";
import type { IconversationWithUser } from "../../types/common";
import { socket } from "../../utils/socket";

interface UnreadUpdate {
  channel: string;
  unreadCount: number;
}

const Chat: React.FC = () => {
  const [convesation, setConversation] = useState<IconversationWithUser[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const investorId = user._id;
  const [senderIdChatBox, setSenderIdChatBox] = useState("");
  const [recieverIdChatBox, setRecieverIdChatBox] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const fetchConversations = useCallback(async () => {
    try {
      const res = await getConversation(investorId);
      if (!res.success) return;

      setConversation(res.conversations);

      setUnreadCounts((prev) => {
        const updated = { ...prev };
        res.conversations.forEach((c: UnreadUpdate) => {
          if (!(c.channel in prev)) {
            updated[c.channel] = c.unreadCount || 0;
          }
        });
        return updated;
      });
    } catch (err) {
      console.log("Error fetching conversations:", err);
    }
  }, [investorId]); // dependencies needed inside fetchConversations

  // Fetch conversations when senderIdChatBox changes
  useEffect(() => {
    fetchConversations();
  }, [senderIdChatBox, fetchConversations]);

  // Handle socket "conversation_changed" updates
  useEffect(() => {
    socket.connect();

    const refresh = () => {
      console.log("Parent: conversation update received");
      fetchConversations();
    };

    socket.on("conversation_changed", refresh);

    return () => {
      socket.off("conversation_changed", refresh);
    };
  }, [fetchConversations]);

  // Join investor room
  useEffect(() => {
    socket.emit("join_room", investorId);
  }, [investorId]);

  // Handle unread_count_update event
  useEffect(() => {
    socket.connect();

    const handleUnreadUpdate = ({ channel, unreadCount }: UnreadUpdate) => {
      console.log("CHANNEL:", channel, "COUNT:", unreadCount);
      setUnreadCounts((prev) => ({
        ...prev,
        [channel]: unreadCount,
      }));
    };

    socket.on("unread_count_update", handleUnreadUpdate);

    return () => {
      socket.off("unread_count_update", handleUnreadUpdate);
    };
  }, []);

  // Optional: Debug re-renders
  useEffect(() => {
    console.log("RERENDER — unreadCounts:", unreadCounts);
  }, [unreadCounts]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 mt-4 bg-gray-100 rounded-t-lg">
          <div className="flex w-full h-full gap-6">
            <div className="w-1/3 bg-white rounded-xl shadow p-4 flex flex-col max-h-[83vh]">
              <input
                type="text"
                placeholder="Search here..."
                className="w-full mb-4 px-4 py-2 bg-gray-100 rounded-lg outline-none"
              />

              <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-2">
                {convesation.map((u) => (
                  <div
                    key={u.channel}
                    onClick={() => {
                      setSenderIdChatBox(investorId);
                      const receiver = u.participants.find(
                        (p) => p.role === "company",
                      );
                      setRecieverIdChatBox(receiver?.userId || "");
                      setUserName(u.userName || "");
                      setProfileImage(u.profileImage || "");
                    }}
                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profileImage}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">{u.userName}</h4>
                        <p className="text-sm text-gray-500">{u.lastMessage}</p>
                      </div>
                    </div>

                    <span className="text-xs text-green-600 font-semibold">
                      {u.createdAt ? formatChatTimestamp(u.createdAt) : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!senderIdChatBox || !recieverIdChatBox ? (
              <div className="flex-1 bg-white rounded-xl shadow flex items-center justify-center text-gray-500 text-lg">
                <p>Select a conversation to start chatting</p>
              </div>
            ) : (
              <ChatBox
                senderId={senderIdChatBox}
                receiverId={recieverIdChatBox}
                userName={userName}
                profileImage={profileImage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
