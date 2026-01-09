export const ADMIN_BASE_ROUTE = "admin";
export const CUSTOMER_BASE_ROUTE = "customer";
export const COMPANY_BASE_ROUTE = "company";
export const INVESTOR_BASE_ROUTE = "investor";

export const INVESTOR_PROFILE_ROUTES = {
  PROFILE: (id: string) => `/${INVESTOR_BASE_ROUTE}/${id}/profile`,
  UPDATE_PROFILE: (id: string) => `/${INVESTOR_BASE_ROUTE}/${id}/updateProfile`,
  UPDATE_PROFILE_IMAGE: (id: string) => `/${INVESTOR_BASE_ROUTE}/${id}/profile`,
  REAPPLY: (id: string) => `/${INVESTOR_BASE_ROUTE}/profile/reapply/${id}`,
};

export const COMMON_ROUTES = {
  CHANGE_PASSWORD: (role: string, id: string) =>
    `/${role}/profile/changePassword/${id}`,
};

export const INVESTOR_ROUTES = {
  GET_FRANCHISES: (page?: number) =>
    `${INVESTOR_BASE_ROUTE}/franchises?page=${page ?? 1}`,
  GET_FRANCHISE_DETAILS: (id: string) =>
    `${INVESTOR_BASE_ROUTE}/franchise/${id}`,
  APPLY_APPLICATION: (investorId: string, franchiseId: string) =>
    `${INVESTOR_BASE_ROUTE}/franchise/${investorId}/${franchiseId}`,
  GET_APPLICATIONS: (investorId: string, page: number) =>
    `${INVESTOR_BASE_ROUTE}/applications/${investorId}?page=${page}`,
  GET_MY_FRANCHISES: (investorId: string) =>
    `${INVESTOR_BASE_ROUTE}/myFranchises/${investorId}`,
  DELETE_APPLICATION: (applicationId: string) =>
    `${INVESTOR_BASE_ROUTE}/applications/${applicationId}`,
  PAY_ADVANCE: (investorId: string, applicationId: string) =>
    `${INVESTOR_BASE_ROUTE}/applications/payAdvance/${investorId}/${applicationId}`,
  VERIFY_PAY_ADVANCE: (investorId: string, applicationId: string) =>
    `${INVESTOR_BASE_ROUTE}/application/verifyPayAdvance/${investorId}/${applicationId}`,
  APPLY_REPORT: (investorId: string) =>
    `${INVESTOR_BASE_ROUTE}/report/franchise/${investorId}`,
};

export const AUTH_ROUTES = {
  REGISTER: (role: string) => `/${role}/auth/register`,
  LOGIN: (role: string) => `/${role}/auth/login`,
  VERIFY_OTP: (role: string) => `/${role}/auth/verify-otp`,
  RESEND_OTP: (role: string) => `/${role}/auth/resend-otp`,
  FORGOT_PASSWORD: (role: string) => `/${role}/auth/login/forgot-password`,
  CHANGE_PASSWORD: (role: string) => `/${role}/auth/login/changePassword`,
  GOOGLE: (role: string) => `/${role}/google`,
  GOOGLE_SUCCESS: (role: string) => `/${role}/google/success`,
  COMPANY_REGISTER: `/${COMPANY_BASE_ROUTE}/auth/register`,
  VERIFY_EMAIL: (token: string) => `/company/auth/verify-email?token=${token}`,
  LOGOUT: (id: string) => `/investor/auth/logout/${id}`,
};

export const COMPANY_AUTH_ROUTES = {
  RESEND_LINK: "/company/auth/verify-email/resendLink",
  FORGOT_PASSWORD: "/company/auth/login/forgot-password",
};

export const NOTIFICATION_ROUTES = {
  GET_ALL: (role: string, userId: string) => `/${role}/${userId}/notifications`,

  UPDATE: (role: string, notificationId: string) =>
    `/${role}/notifications/${notificationId}`,
};

export const MESSAGE_BASE_ROUTE = "message";
export const MESSAGE_ROUTES = {
  SEND_MESSAGE: `${MESSAGE_BASE_ROUTE}/chats/messages`,
  FETCH_MESSAGES: `${MESSAGE_BASE_ROUTE}/chats/messages`,
  GET_CONVERSATION: `${MESSAGE_BASE_ROUTE}/chats/approved`,
};
export const CUSTOMER_PROFILE = {
  ADD_ADDRESS: (customerId: string) =>
    `/${CUSTOMER_BASE_ROUTE}/profile/address/${customerId}`,
  EDIT_ADDRESS: (addressId: string) =>
    `/${CUSTOMER_BASE_ROUTE}/profile/address/${addressId}`,
  DELETE_ADDRESS: (addressId: string) =>
    `/${CUSTOMER_BASE_ROUTE}/profile/address/${addressId}`,
  GET_ADDRESS: (customerId: string) =>
    `/${CUSTOMER_BASE_ROUTE}/profile/address/${customerId}`,
  GET_CUSTOMER: (customerId: string) =>
    `/${CUSTOMER_BASE_ROUTE}/profile/${customerId}`,
};

export const COMPANY = {
  PROFILE: (id: string) => `/company/profile/${id}`,
  PROFILE_CHANGE_LOGO: (id: string) => `/company/profile/${id}/changeLogo`,

  FRANCHISE: {
    GET: (companyId: string, page?: number) =>
      `/company/franchise/${companyId}?page=${page}`,

    SPECIFIC: (id: string) => `/company/franchise/getFranchise/${id}`,

    ADD: (companyId: string) => `/company/franchise/${companyId}`,
    EDIT: (id: string) => `/company/franchise/${id}`,
    DELETE: (id: string) => `/company/franchise/${id}`,
  },

  APPLICATION: {
    ALL: (id: string, page: number) =>
      `/company/application/${id}?page=${page}`,
    UPDATE: (id: string) => `/company/application/${id}`,
  },

  PRODUCT_CATEGORY: {
    GET: (companyId: string) => `/company/productCategory/${companyId}`,
    EDIT: (companyId: string, categoryId: string) =>
      `/company/productCategory/${companyId}/${categoryId}`,
    DELETE: (companyId: string, categoryId: string) =>
      `/company/productCategory/${companyId}/${categoryId}`,
    ADD: (companyId: string) => `/company/productCategory/${companyId}`,
  },

  PRODUCT: {
    ADD: (companyId: string) => `/company/product/${companyId}`,
    EDIT: (companyId: string, productId: string) =>
      `/company/product/${companyId}/${productId}`,
    DELETE: (productId: string) => `/company/product/${productId}`,
    GET: (companyId: string, page: number) =>
      `/company/product/${companyId}?page=${page}`,
  },

  SUBSCRIPTION: {
    CREATE: (companyId: string) => `/company/subscription/${companyId}`,
    VERIFY: (companyId: string) => `/company/subscription/verify/${companyId}`,
  },
};

export const ADMIN_API = {
  USERS: (role: string, page: number) =>
    `/${ADMIN_BASE_ROUTE}/${role}?page=${page}`,

  PENDING_USERS: (role: string, page: number) =>
    `/${ADMIN_BASE_ROUTE}/${role}/pending?page=${page}`,

  BLOCK_USER: (role: string, id: string) =>
    `/${ADMIN_BASE_ROUTE}/${role}/block/${id}`,

  VERIFY_USER: (role: string, id: string) =>
    `/${ADMIN_BASE_ROUTE}/${role}/verify/${id}`,

  COMPANY_DETAILS: (id: string) => `/${ADMIN_BASE_ROUTE}/company/${id}`,

  INVESTOR_DETAILS: (id: string) => `/${ADMIN_BASE_ROUTE}/investor/${id}`,

  CATEGORY: `/${ADMIN_BASE_ROUTE}/industryCategory`,

  DELETE_CATEGORY: (id: string) =>
    `/${ADMIN_BASE_ROUTE}/industryCategory/${id}`,

  REPORTS: `/${ADMIN_BASE_ROUTE}/report`,
};
