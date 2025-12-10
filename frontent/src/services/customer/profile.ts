import {  CUSTOMER_PROFILE } from "../../constants/apiRoutes";
import type { IAddress } from "../../types/customer";
import api from "../api";

export const addAddress = async (formData: IAddress, customerId: string) => {
  try {
    const response = await api.post(
      CUSTOMER_PROFILE.ADD_ADDRESS(customerId),
      { formData },
    );
    return response.data;
  } catch (error) {
    console.log("Error adding address :", error);
    throw error;
  }
};

export const getAddress = async (customerId: string) => {
  try {
    const response = await api.get(
      CUSTOMER_PROFILE.GET_ADDRESS(customerId),
    );
    return response.data;
  } catch (error) {
    console.log("Error getting address :", error);
    throw error;
  }
};
export const getCustomerAPI = async (customerId: string) => {
  try {
    const response = await api.get(
      CUSTOMER_PROFILE.GET_CUSTOMER(customerId),
    );
    return response.data;
  } catch (error) {
    console.log("Error getting customer :", error);
    throw error;
  }
};
export const editAddress = async (formData: IAddress, addressId: string) => {
  try {
    const response = await api.put(
      CUSTOMER_PROFILE.EDIT_ADDRESS(addressId),
      { formData },
    );
    return response.data;
  } catch (error) {
    console.log("Error updating address :", error);
    throw error;
  }
};
export const deleteAddress = async (addressId: string) => {
  try {
    const response = await api.delete(
     CUSTOMER_PROFILE.DELETE_ADDRESS(addressId),
    );
    return response.data;
  } catch (error) {
    console.log("Error deleting address :", error);
    throw error;
  }
};
