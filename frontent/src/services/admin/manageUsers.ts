import { ADMIN_BASE_ROUTE } from "../../constants/apiRoutes";
import api from "../api";

export const getUsersAPI = async (role: string, page: number) => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/${role}?page=${page}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getPendingUsersAPI = async (role: string, page: number) => {
  try {
    const response = await api.get(
      `${ADMIN_BASE_ROUTE}/${role}/pending?page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const blockUsersAPI = async (
  id: string,
  role: string,
  block: boolean,
) => {
  try {
    const response = await api.put(`${ADMIN_BASE_ROUTE}/${role}/block/${id}`, {
      block,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const changeStatusUsersAPI = async (
  id: string,
  role: string,
  status: "approve" | "reject",
  reason?: string,
) => {
  try {
    const response = await api.put(`${ADMIN_BASE_ROUTE}/${role}/verify/${id}`, {
      status,
      reason,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getCompanyDetails = async (id: string) => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/company/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getInvestorDetails = async (id: string) => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/investor/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addCategories = async (data: FormData) => {
  try {
    const response = await api.post(`${ADMIN_BASE_ROUTE}/industryCategory`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const editCategories = async (data: FormData) => {
  try {
    const response = await api.put(`${ADMIN_BASE_ROUTE}/industryCategory`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getCategories = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/industryCategory`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(
      `${ADMIN_BASE_ROUTE}/industryCategory/${id}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getReports = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/report`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
