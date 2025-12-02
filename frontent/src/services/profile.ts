import { AxiosError } from "axios";
import api from "./api";
import type { Investor } from "../types/investor";
import { INVESTOR_BASE_ROUTE } from "../constants/apiRoutes";

export const getProfile = async (seekerId: string) => {
    try {
        const response = await api.get(`/${INVESTOR_BASE_ROUTE}/${seekerId}/profile`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Get profile error:", error.response?.data);
            throw error;
        }
        throw new Error("Something went wrong. Please try again.");
    }

};

export const updateProfileImage = async (formData: FormData, seekerId: string) => {
    try {
        const res = await api.put(`${INVESTOR_BASE_ROUTE}/${seekerId}/profile`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Edit profile:", error?.response?.data);
            throw new Error(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
        throw new Error("Something went wrong. Please try again.");
    }
};

export const updateProfile = async (formData: Partial<Investor>, seekerId: string) => {
    try {
        const res = await api.put(`${INVESTOR_BASE_ROUTE}/${seekerId}/updateProfile`, formData);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Edit profile:", error?.response?.data);
            throw error;
        }
    }
};

export const changePassword = async (role:string, id: string,data:{oldPassword:string,newPassword:string}) => {
    try {
        const res = await api.put(`${role}/profile/changePassword/${id}`, {data});
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Change Password :", error?.response?.data);
            throw error;
        }
    }
};
export const reApply = async (id: string) => {
    try {
        const res = await api.put(`/${INVESTOR_BASE_ROUTE}/profile/reapply/${id}`);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Change Password :", error?.response?.data);
            throw error;
        }
    }
};