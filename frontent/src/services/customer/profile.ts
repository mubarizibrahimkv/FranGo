import { CUSTOMER_BASE_ROUTE } from "../../constants/apiRoutes";
import type { IAddress } from "../../types/customer";
import api from "../api";


export const addAddress=async(formData:IAddress,customerId:string)=>{
    try {
        const response=await api.post(`/${CUSTOMER_BASE_ROUTE}/profile/address/${customerId}`,{formData});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAddress=async(customerId:string)=>{
    try {
        const response=await api.get(`/${CUSTOMER_BASE_ROUTE}/profile/address/${customerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getCustomerAPI=async(customerId:string)=>{
    try {
        const response=await api.get(`/${CUSTOMER_BASE_ROUTE}/profile/${customerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const editAddress=async(formData:IAddress,addressId:string)=>{
    console.log(addressId,"addressid in seivce");
    try {
        const response=await api.put(`/${CUSTOMER_BASE_ROUTE}/profile/address/${addressId}`,{formData});
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const deleteAddress=async(addressId:string)=>{
    try {
        const response=await api.delete(`/${CUSTOMER_BASE_ROUTE}/profile/address/${addressId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};