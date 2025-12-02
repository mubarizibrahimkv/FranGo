import { AxiosError } from "axios";
import api from "../api";
import type { Company, IFranchise } from "../../types/company";
import { COMPANY_BASE_ROUTE } from "../../constants/apiRoutes";

export const fetchCompany = async (companyId: string) => {
  try {
    const res = await api.get(`/${COMPANY_BASE_ROUTE}/profile/${companyId}`);
    return res.data;
  } catch (error) {
    console.log("Error fetching company :", error);
    throw error;
  }
};

export const getFranchise = async (companyId: string, page: number) => {
  try {
    const res = await api.get(
      `/${COMPANY_BASE_ROUTE}/franchise/${companyId}?page=${page}`,
    );
    return res.data;
  } catch (error) {
    console.log("Error fetching franchises :", error);
    throw error;
  }
};
export const getSpecificFranchise = async (franchiseId: string) => {
  try {
    const res = await api.get(
      `/${COMPANY_BASE_ROUTE}/franchise/getFranchise/${franchiseId}`,
    );
    return res.data;
  } catch (error) {
    console.log("Error fetching fanchise details :", error);
    throw error;
  }
};

export const addFranchise = async (companyId: string, data: IFranchise) => {
  try {
    const res = await api.post(
      `/${COMPANY_BASE_ROUTE}/franchise/${companyId}`,
      { data },
    );
    return res.data;
  } catch (error) {
    console.log("Error creating franchise :", error);
    throw error;
  }
};
export const editFranchise = async (franchiseId: string, data: IFranchise) => {
  try {
    const res = await api.put(
      `/${COMPANY_BASE_ROUTE}/franchise/${franchiseId}`,
      data,
    );
    return res.data;
  } catch (error) {
    console.log("Error updating franchise :", error);
    throw error;
  }
};
export const deleteFranchise = async (franchiseId: string) => {
  try {
    const res = await api.delete(
      `/${COMPANY_BASE_ROUTE}/franchise/${franchiseId}`,
    );
    return res.data;
  } catch (error) {
    console.log("Error deleting franchise :", error);
    throw error;
  }
};

export const changeLogo = async (formData: FormData, companyId: string) => {
  try {
    const res = await api.put(
      `/${COMPANY_BASE_ROUTE}/profile/${companyId}/changeLogo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const data = res.data;
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit profile:", error?.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const editProfile = async (companyData: Company, companyId: string) => {
  try {
    const res = await api.put(`/${COMPANY_BASE_ROUTE}/profile/${companyId}`, {
      companyData,
    });
    return res.data;
  } catch (error) {
    console.log("Error updating profile :", error);
    throw error;
  }
};

export const reApply = async (id: string) => {
  try {
    const res = await api.put(`/${COMPANY_BASE_ROUTE}/profile/reapply/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Reapply :", error?.response?.data);
      throw error;
    }
  }
};

export const getApplications = async (id: string, page: number) => {
  try {
    const res = await api.get(
      `/${COMPANY_BASE_ROUTE}/application/${id}?page=${page}`,
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Get applications :", error?.response?.data);
      throw error;
    }
  }
};
export const handleApplicationStatus = async (
  id: string,
  status: "rejected" | "approved" | "pending",
) => {
  try {
    const res = await api.put(`/${COMPANY_BASE_ROUTE}/application/${id}`, {
      status,
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Handel application status :", error?.response?.data);
      throw error;
    }
  }
};
export const getProductCategories = async (id: string) => {
  try {
    const res = await api.get(`/${COMPANY_BASE_ROUTE}/productCategory/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Get productcategory :", error?.response?.data);
      throw error;
    }
  }
};
export const editProductCategories = async (
  companyId: string,
  categoryId: string,
  newName: string,
) => {
  try {
    const res = await api.put(
      `/${COMPANY_BASE_ROUTE}/productCategory/${companyId}/${categoryId}`,
      { newName },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit productcategory :", error?.response?.data);
      throw error;
    }
  }
};
export const deleteProductCategories = async (
  companyId: string,
  categoryId: string,
) => {
  try {
    const res = await api.delete(
      `/${COMPANY_BASE_ROUTE}/productCategory/${companyId}/${categoryId}`,
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Delete productcategory :", error?.response?.data);
      throw error;
    }
  }
};
export const addProductCategories = async (
  id: string,
  data: {
    industryCategoryId: string;
    subCategoryId: string;
    subSubCategoryId: string;
    productCategoryName: string;
  },
) => {
  try {
    const res = await api.post(`/${COMPANY_BASE_ROUTE}/productCategory/${id}`, {
      data,
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Add Product :", error?.response?.data);
      throw error;
    }
  }
};

export const addProduct = async (companyId: string, data: FormData) => {
  try {
    const res = await api.post(
      `/${COMPANY_BASE_ROUTE}/product/${companyId}`,
      data,
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Add Product :", error?.response?.data);
      throw error;
    }
  }
};
export const editProduct = async (
  companyId: string,
  productId: string,
  data: FormData,
) => {
  try {
    const res = await api.put(
      `/${COMPANY_BASE_ROUTE}/product/${companyId}/${productId}`,
      data,
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit Product :", error?.response?.data);
      throw error;
    }
  }
};
export const deleteProduct = async (productId: string) => {
  try {
    const res = await api.delete(`/${COMPANY_BASE_ROUTE}/product/${productId}`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error Delete Product :", error?.response?.data);
      throw error;
    }
  }
};
export const createSubscriptionOrder = async (
  companyId: string,
  amount: number,
) => {
  try {
    const res = await api.post(
      `/${COMPANY_BASE_ROUTE}/subscription/${companyId}`,
      { amount },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error create subscription order :", error?.response?.data);
      throw error;
    }
  }
};
export const getProducts = async (companyId: string, page: number) => {
  try {
    const res = await api.get(
      `/${COMPANY_BASE_ROUTE}/product/${companyId}?page=${page}`,
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error gettting products :", error?.response?.data);
      throw error;
    }
  }
};
export const verifySubscriptionOrder = async (
  companyId: string,
  paymentId: string,
  orderId: string,
  signature: string,
  amount: number,
) => {
  try {
    const res = await api.post(
      `/${COMPANY_BASE_ROUTE}/subscription/verify/${companyId}`,
      { paymentId, orderId, signature, amount },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Verify subscription order :", error?.response?.data);
      throw error;
    }
  }
};
