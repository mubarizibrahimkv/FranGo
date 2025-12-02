import { AxiosError } from "axios";
import api from "./api";

export type IRole = "admin" | "company" | "investor" | "customer";

export const getNotifications = async (role: IRole, userId: string) => {
  try {
    const response = await api.get(`${role}/${userId}/notifications`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch Notification:", error.response?.data);
    }
  }
};

export const updateNotification = async (
  role: IRole,
  notificationId: string,
) => {
  console.log(
    role,
    notificationId,
    "roel and notificaiton id respectively in seriver",
  );
  try {
    const response = await api.put(`${role}/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Updating Notification:", error.response?.data);
    }
  }
};
