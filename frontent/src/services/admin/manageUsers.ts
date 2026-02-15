import { ADMIN_API } from "../../constants/apiRoutes";
import api from "../api";

export const getUsersAPI = async (
  role: string,
  page: number,
  search: string,
  filter?: string,
) => {
  try {
    const response = await api.get(ADMIN_API.USERS(role, page), {
      params: { search, filter },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getPendingUsersAPI = async (
  role: string,
  page: number,
  search: string,
) => {
  try {
    const response = await api.get(ADMIN_API.PENDING_USERS(role, page), {
      params: { search },
    });
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
    const response = await api.put(ADMIN_API.BLOCK_USER(role, id), {
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
    const response = await api.put(ADMIN_API.VERIFY_USER(role, id), {
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
    const response = await api.get(ADMIN_API.COMPANY_DETAILS(id));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getInvestorDetails = async (id: string) => {
  try {
    const response = await api.get(ADMIN_API.INVESTOR_DETAILS(id));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addCategories = async (data: FormData) => {
  try {
    const response = await api.post(ADMIN_API.CATEGORY, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const editCategories = async (data: FormData) => {
  try {
    const response = await api.put(ADMIN_API.CATEGORY, {
      data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getCategories = async (
  search?: string,
  page?: number,
  filter?: string,
) => {
  try {
    const response = await api.get(ADMIN_API.CATEGORY, {
      params: { search, page, filter },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(ADMIN_API.DELETE_CATEGORY(id));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getReports = async (search: string, page: number) => {
  try {
    const response = await api.get(ADMIN_API.REPORTS, {
      params: { search, page },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
