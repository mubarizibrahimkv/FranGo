export interface IAddress {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Customer {
  _id: string;
  userName: string;
  email: string;
  password: string;
  role: "customer" | "admin" | "investor" | "company";
}
