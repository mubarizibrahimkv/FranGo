import api from "./api";
import type { Role } from "../types/common";
import axios, { AxiosError } from "axios";
import { COMPANY_BASE_ROUTE, INVESTOR_BASE_ROUTE } from "../constants/apiRoutes";
const apiUrl = import.meta.env.VITE_API_URL;


interface signUpData {
  userName: string
  email: string
  password: string
  role:string
}


export const signupApi = async (data: signUpData) => {
  const response = await api.post(`/${data.role}/auth/register`, data);
  const user = response.data;
  return user;
};

export const loginApi = async (email: string, password: string,role:Role) => {
  try {
    const response = await api.post(`/${role}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.log(error);  
    throw error;
  }
};

export const verifyOtp = async (data: { otp: string, email: string,role:Role }) => {
  try {
    const response = await api.post(`/${data.role}/auth/verify-otp`, data);
    const user = response.data;
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resendOtpApi = async (email: string,role:Role) => {
  try {
    const response = await api.post( `/${role}/auth/resend-otp`, { email });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const companySignupApi = async (formData: FormData) => {
  try {
    const result = await api.post(`/${COMPANY_BASE_ROUTE}/auth/register`, formData,{
      headers:{
        "Content-Type": "multipart/form-data",
      }
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail=async (token:string)=>{
  try {
    const company=await api.get(`/${COMPANY_BASE_ROUTE}/auth/verify-email?token=${token}`);
    return company.data;
  } catch (error) {
    throw error;
  }
};


export const logout=async(id:string)=>{
    try {
        const res=await api.post(`/${INVESTOR_BASE_ROUTE}/auth/logout/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const resendLink=async({ email, purpose }: { email: string; purpose?: string })=>{
    try {
        const res=await api.post(`/${COMPANY_BASE_ROUTE}/auth/verify-email/resendLink`,{ email, purpose });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const forgotPassword=async(email:string,role:string)=>{
  try {
        const res=await api.post(`/${role}/auth/login/forgot-password`,{email});
        return res.data;
    } catch (error) {
        throw error;
    }
};
export const forgotPasswordCumpany=async(email:string)=>{
  try {
      const res=await api.post(`/${COMPANY_BASE_ROUTE}/auth/login/forgot-password`,{email});
      return res.data;
    } catch (error) {
        throw error;
    }
};
export const changePassword=async(email:string,password:string,role:Role)=>{
  try {
      const res=await api.post(`/${role}/auth/login/changePassword`,{email,password});
      return res.data;
    } catch (error) {
        throw error;
    }
};

export const googleLogin = (role: string) => {
  const GOOGLE_URL = `${apiUrl}/${role}/google`;
  console.log(`Google login clicked for role: ${role}`);
  window.open(GOOGLE_URL, "_self");
};

export const fetchGoogleUser = async (role: string) => {
  console.log("serojvin success ggoogle");
  try {
    const response = await axios.get(
      `${apiUrl}/${role}/google/success`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Login Error:", error.response?.data);
    }
  }
};