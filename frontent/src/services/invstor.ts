import { AxiosError } from "axios";
import api from "./api";
import { INVESTOR_BASE_ROUTE } from "../constants/apiRoutes";
import type { IApiParams } from "../pages/Investor/ExploreFranchise";
import type { Investor } from "../types/investor";

export const getFranchises = async (params?: IApiParams, page?: number) => {
    try {
        const res = await api.get(`${INVESTOR_BASE_ROUTE}/franchises?page=${page}`, { params });
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Get Franchise:", error?.response?.data);
            throw error;
        }
    }
};
export const getFranchiseDetails = async (id: string) => {
    try {
        const res = await api.get(`${INVESTOR_BASE_ROUTE}/franchise/${id}`);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Get Franchise Details:", error?.response?.data);
            throw error;
        }
    }
};
export const applyAApplication = async (formData: Investor, franchiseId: string, investorId: string) => {
    try {
        const res = await api.post(`${INVESTOR_BASE_ROUTE}/franchise/${investorId}/${franchiseId}`, { formData });
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Apply application", error?.response?.data);
            throw error;
        }
    }
};
export const getAApplication = async (investorId: string, page: number) => {
    try {
        const res = await api.get(`${INVESTOR_BASE_ROUTE}/applications/${investorId}?page=${page}`);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Apply application", error?.response?.data);
            throw error;
        }
    }
};
export const payAdvance = async (investorId: string, applicationId: string, data: { amount: number, type: "advance" | "subscription", method: "razorpay" }) => {
    try {
        const res = await api.post(`${INVESTOR_BASE_ROUTE}/applications/payAdvance/${investorId}/${applicationId}`, { data });
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Apply application", error?.response?.data);
            throw error;
        }
    }
};

export const verifyPayAdvanceOrder = async (investorId: string, applicationId: string, paymentId: string, orderId: string, signature: string, amount: number) => {
    try {
        const res = await api.post(`/${INVESTOR_BASE_ROUTE}/application/verifyPayAdvance/${investorId}/${applicationId}`, { paymentId, orderId, signature, amount });
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Change Password :", error?.response?.data);
            throw error;
        }
    }
};  


export const applyReport = async (franchiseId: string,investorId:string, reason: string) => {
    console.log("apply report service ")
    try {
        const res = await api.post(`/${INVESTOR_BASE_ROUTE}/report/franchise/${investorId}`, { franchiseId,reason });
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Rport Frahchise :", error?.response?.data);
            throw error;
        }
    }
}
