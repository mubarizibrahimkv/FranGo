import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications } from "../../services/notificationService";
import type { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import type { INotification } from "../../types/common";
import Notification from "../CommonComponents/Notification";
import { socket } from "../../utils/socket";

interface NavbarProps {
  heading: string;
}

const AdminNavbar: React.FC<NavbarProps> = ({ heading }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state: RootState) => state.user);
  const userId = user?._id || "";
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const closeNotificationComponent = () => {
    setIsOpenNotification(false);
  };

  useEffect(() => {
    socket.on("connect", () => {});
  }, []);

  useEffect(() => {
    if (!user.isAuthenticated) return;

    const handleNotification = () => {
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("receive_notification", handleNotification);

    return () => {
      socket.off("receive_notification", handleNotification);
    };
  }, [user.isAuthenticated]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getNotifications("admin", userId);
        const unread = res.notifications.filter(
          (n: INotification) => !n.isRead,
        ).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error(err);
      }
    };

    if (user.isAuthenticated) fetchUnreadCount();
  }, [userId, user.isAuthenticated]);

  return (
    <header className="w-full h-16 bg-white flex items-center justify-between px-8 shadow-md sticky top-0 z-50">
      <h2 className="text-2xl font-extrabold font-serif text-gray-800">
        {heading}
      </h2>
      <div className="flex items-center space-x-6">
        <button
          className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => setIsOpenNotification(true)}
        >
          <Bell className="w-6 h-6" />

          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px]
        font-bold rounded-full h-4 w-4 flex items-center justify-center"
            >
              {unreadCount}
            </span>
          )}
        </button>

        {isOpenNotification && (
          <Notification onClose={closeNotificationComponent} />
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
