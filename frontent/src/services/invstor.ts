import { AxiosError } from "axios";
import api from "./api";
import { INVESTOR_ROUTES } from "../constants/apiRoutes";
import type { IApiParams } from "../pages/Investor/ExploreFranchise";
import type { Investor } from "../types/investor";

export const getFranchises = async (params?: IApiParams, page?: number) => {
  try {
    const res = await api.get(
       INVESTOR_ROUTES.GET_FRANCHISES(page),
      { params },
    );
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
    const res = await api.get( INVESTOR_ROUTES.GET_FRANCHISE_DETAILS(id));
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Get Franchise Details:", error?.response?.data);
      throw error;
    }
  }
};
export const applyAApplication = async (
  formData: Investor,
  franchiseId: string,
  investorId: string,
) => {
  try {
    const res = await api.post(
      INVESTOR_ROUTES.APPLY_APPLICATION(
        investorId,
        franchiseId,
      ),
      { formData },
    );
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
    const res = await api.get(
      INVESTOR_ROUTES.GET_APPLICATIONS(investorId, page),
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Apply application", error?.response?.data);
      throw error;
    }
  }
};
export const getMyFranchises = async (investorId: string) => {
  try {
    console.log(investorId, "invevestori in my franshi");
    const res = await api.get(
     INVESTOR_ROUTES.GET_MY_FRANCHISES(investorId),
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Get myfranchises", error?.response?.data);
      throw error;
    }
  }
};
export const deleteApplication = async (applicationId: string) => {
  try {
    const res = await api.delete(
      INVESTOR_ROUTES.DELETE_APPLICATION(applicationId),
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Delete Applications", error?.response?.data);
      throw error;
    }
  }
};
export const payAdvance = async (
  investorId: string,
  applicationId: string,
  data: {
    amount: number;
    type: "advance" | "subscription";
    method: "razorpay";
  },
) => {
  try {
    const res = await api.post(
      INVESTOR_ROUTES.PAY_ADVANCE(
        investorId,
        applicationId,
      ),
      { data },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Apply application", error?.response?.data);
      throw error;
    }
  }
};

export const verifyPayAdvanceOrder = async (
  investorId: string,
  applicationId: string,
  paymentId: string,
  orderId: string,
  signature: string,
  amount: number,
) => {
  try {
    const res = await api.post(
           INVESTOR_ROUTES.VERIFY_PAY_ADVANCE(
        investorId,
        applicationId,
      ),

      { paymentId, orderId, signature, amount },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Change Password :", error?.response?.data);
      throw error;
    }
  }
};

export const applyReport = async (
  franchiseId: string,
  investorId: string,
  reason: string,
) => {
  try {
    const res = await api.post(
      INVESTOR_ROUTES.APPLY_REPORT(investorId),
      { franchiseId, reason },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Rport Frahchise :", error?.response?.data);
      throw error;
    }
  }
};
