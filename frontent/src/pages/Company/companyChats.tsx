import React, { useEffect, useState } from "react";
import Sidebar from "../../components/CompanyComponents/Sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { getConversation } from "../../services/messageService";
import Navbar from "../../components/CompanyComponents/Navbar";
import { formatChatTimestamp } from "../../utils/formatTimeStamp";
import type { IconversationWithUser } from "../../types/common";
import ChatBox from "../../components/CommonComponents/ChatBox";
import { socket } from "../../utils/socket";

const Chat: React.FC = () => {
  const [convesation, setConversation] = useState<IconversationWithUser[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const companyId = user._id;
  const [senderIdChatBox, setSenderIdChatBox] = useState("");
  const [recieverIdChatBox, setRecieverIdChatBox] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const fetchConversations = async () => {
    try {
      const res = await getConversation(companyId);
      if (!res.success) return;

      setConversation(res.conversations);

      setUnreadCounts((prev) => {
        const updated = { ...prev };

        res.conversations.forEach((c: any) => {
          if (!(c.channel in prev)) {
            updated[c.channel] = c.unreadCount || 0; 
          }
        });

        return updated;
      });
    } catch (err) {
      console.log("Error fetching conversations:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [senderIdChatBox]);

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
  }, []);

  useEffect(() => {
    socket.emit("join_room", companyId);
  }, []);

  useEffect(() => {
    console.log("useeffect is working");
    socket.connect();

    socket.on("unread_count_update", ({ channel, unreadCount }) => {
      console.log("CHANNEL:", channel, "COUNT:", unreadCount);
      setUnreadCounts((prev) => ({
        ...prev,
        [channel]: unreadCount,
      }));
    });

    return () => {
      socket.off("unread_count_update");
    };
  }, []);

  useEffect(() => {
    console.log("RERENDER — unreadCounts:", unreadCounts);
  }, [unreadCounts]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading="Chats" />

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
                      setSelectedChannel(u.channel);
                      setSenderIdChatBox(companyId);
                      const receiver = u.participants.find(
                        (p) => p.role === "investor"
                      );
                      setUnreadCounts((prev) => ({
                        ...prev,
                        [u.channel]: 0,
                      }));

                      setRecieverIdChatBox(receiver?.userId || "");
                      setUserName(u.userName || "");
                      setProfileImage(u.profileImage || "");
                    }}
                    className={`
                    flex items-center justify-between p-3 rounded-lg cursor-pointer
                    ${
                      selectedChannel === u.channel
                        ? "bg-gray-200 "
                        : "bg-gray-100"
                    }
                    hover:bg-gray-100
                  `}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profileImage}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">{u.userName}</h4>
                        <p className="text-sm text-gray-500">
                          {companyId === u.lastSender
                            ? `You: ${u.lastMessage}`
                            : u.lastMessage}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs flex flex-col items-center text-green-600 font-semibold">
                      {u.updatedAt ? formatChatTimestamp(u.updatedAt) : "N/A"}

                      {unreadCounts[u.channel] > 0 &&
                        selectedChannel !== u.channel && (
                          <span className="bg-green-500 text-white rounded-full text-[10px] px-1 mt-1">
                            {unreadCounts[u.channel]}
                          </span>
                        )}
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

            {/* render chat full */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
