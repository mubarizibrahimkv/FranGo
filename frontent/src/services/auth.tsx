import api from "./api";
import type { Role } from "../types/common";
import axios, { AxiosError } from "axios";
import { AUTH_ROUTES, COMPANY_AUTH_ROUTES } from "../constants/apiRoutes";
const apiUrl = import.meta.env.VITE_API_URL;

interface signUpData {
  userName: string;
  email: string;
  password: string;
  role: string;
}

export const signupApi = async (data: signUpData) => {
  const response = await api.post(AUTH_ROUTES.REGISTER(data.role), data);
  const user = response.data;
  return user;
};

export const loginApi = async (email: string, password: string, role: Role) => {
  try {
    const response = await api.post(AUTH_ROUTES.LOGIN(role), {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyOtp = async (data: {
  otp: string;
  email: string;
  role: Role;
}) => {
  try {
    const response = await api.post(AUTH_ROUTES.VERIFY_OTP(data.role), data);
    const user = response.data;
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resendOtpApi = async (email: string, role: Role) => {
  try {
    const response = await api.post(AUTH_ROUTES.RESEND_OTP(role), { email });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const companySignupApi = async (formData: FormData) => {
  try {
    const result = await api.post(AUTH_ROUTES.COMPANY_REGISTER, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const company = await api.get(AUTH_ROUTES.VERIFY_EMAIL(token));
    return company.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async (id: string) => {
  try {
    const res = await api.post(AUTH_ROUTES.LOGOUT(id));
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resendLink = async ({
  email,
  purpose,
}: {
  email: string;
  purpose?: string;
}) => {
  try {
    const res = await api.post(COMPANY_AUTH_ROUTES.RESEND_LINK, {
      email,
      purpose,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const forgotPassword = async (email: string, role: string) => {
  try {
    const res = await api.post(AUTH_ROUTES.FORGOT_PASSWORD(role), {
      email,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const forgotPasswordCumpany = async (email: string) => {
  try {
    const res = await api.post(COMPANY_AUTH_ROUTES.FORGOT_PASSWORD, { email });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const changePassword = async (
  email: string,
  password: string,
  role: Role,
) => {
  try {
    const res = await api.post(AUTH_ROUTES.CHANGE_PASSWORD(role), {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const googleLogin = (role: string) => {
  const GOOGLE_URL = `${apiUrl}${AUTH_ROUTES.GOOGLE(role)}`;
  console.log(`Google login clicked for role: ${role}`);
  window.open(GOOGLE_URL, "_self");
};

export const fetchGoogleUser = async (role: string) => {
  console.log("serojvin success ggoogle");
  try {
    const response = await axios.get(
      `${apiUrl}${AUTH_ROUTES.GOOGLE_SUCCESS(role)}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Login Error:", error.response?.data);
    }
  }
};
