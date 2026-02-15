import { AxiosError } from "axios";
import api from "./api";
import type { ICoupon, IOffer } from "../types/discount";
import { COMPANY_BASE_ROUTE } from "../constants/apiRoutes";

export const addDiscount = async (
  form: IOffer | ICoupon,
  discountType: "offer" | "coupon",
  companyId: string,
) => {
  try {
    const res = await api.post(
      `/${COMPANY_BASE_ROUTE}/${discountType}/${companyId}`,
      form,
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const updateDiscount = async (
  form: IOffer | ICoupon,
  discountType: "offer" | "coupon",
  companyId: string,
) => {
  try {
    const res = await api.put(
      `/${COMPANY_BASE_ROUTE}/${discountType}/${companyId}`,
      form,
      { params: { id: form._id } },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const getDiscount = async (
  discountType: "offer" | "coupon",
  companyId: string,
  page?: number,
  search?: string,
) => {
  try {
    const res = await api.get(
      `/${COMPANY_BASE_ROUTE}/${discountType}/${companyId}`,
      { params: { page, search } },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const deleteDiscount = async (
  discountType: "offer" | "coupon",
  companyId: string,
  discountId: string,
) => {
  console.log(companyId, discountId, "fvbfgvg");
  try {
    const res = await api.patch(
      `/${COMPANY_BASE_ROUTE}/${discountType}/${companyId}`,
      {},
      { params: { id: discountId } },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    }
    throw error;
  }
};
