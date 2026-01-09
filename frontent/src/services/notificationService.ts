import { AxiosError } from "axios";
import api from "./api";
import { NOTIFICATION_ROUTES } from "../constants/apiRoutes";

export type IRole = "admin" | "company" | "investor" | "customer";

export const getNotifications = async (role: IRole, userId: string) => {
  try {
    const response = await api.get(NOTIFICATION_ROUTES.GET_ALL(role, userId));
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
    const response = await api.put(
      NOTIFICATION_ROUTES.UPDATE(role, notificationId),
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Updating Notification:", error.response?.data);
    }
  }
};
