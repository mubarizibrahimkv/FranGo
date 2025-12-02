import type React from "react";
import { useEffect, useState } from "react";
import type { INotification } from "../../types/common";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store.js";
import {
  getNotifications,
  updateNotification,
} from "../../services/notificationService.js";

interface notificationProp {
  onClose(): void;
}

const Notification: React.FC<notificationProp> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<INotification[]>();
  const user = useSelector((state: RootState) => state.user);
  const userId = user?._id || "";
  const userRole = user.isAdmin ? "admin" : user.role;

  useEffect(() => {
    const handleNotifications = async () => {
      try {
        const response = await getNotifications(userRole, userId || "");
        setNotifications(response.notifications);
      } catch (error) {
        console.error("the error ", error);
      }
    };
    handleNotifications();
  }, [userId]);

  const handeUpdate = async (notificationId: string) => {
    console.log(notificationId,"notification id")
    console.log(notificationId,"notification id")
    try {
      const response = await updateNotification(
        userRole,
        notificationId
      );
      if(response.success){
        setNotifications(response.updatedNotification);
      }
    } catch (error) {
      console.error("Error updating notification", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white h-full shadow-xl overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Notifications</h1>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>
        <hr className="text-gray-300" />
        <br />

        {notifications?.map((notification, index) => (
          <div
            key={index}
            className="py-3 border-b border-gray-200 flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-black leading-tight">
                <h1 className="text-black text-sm sm:text-lg md:text-lg font-semibold">
                  {notification.message &&
                  notification.message.startsWith("Your meeting")
                    ? `${notification.message.slice(
                        0,
                        30
                      )}...\n${notification.message.slice(-47)}`
                    : notification.message}
                </h1>
              </p>

              <p className="text-gray-400 text-xs mt-1">
                {new Date(notification.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <button
              disabled={notification.isRead}
              onClick={() => handeUpdate(notification._id)}
              className={`text-xs font-semibold p-3 rounded bg-[#1F3C58] ${
                notification.isRead
                  ? "opacity-50 cursor-not-allowed"
                  : "text-white hover:underline"
              }`}
            >
              {notification.isRead ? "Read" : "Mark"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
