import api from "../api";

export const getFranchisesByCategory = async (industryCategoryId: string, page: number, search: string) => {
  try {
    const response = await api.get("/customer/franchise", {
      params: { industryCategoryId, page, search },
    });
    return response.data;
  } catch (error) {
    console.log("Error getting franchises in cusotmer side :", error);
    throw error;
  }
};