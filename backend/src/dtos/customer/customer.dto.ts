export interface CustomerDTO {
  _id: string;
  userName: string;
  email: string;
  role?: "customer" | "admin" | "investor" | "company";
  isBlocked?: boolean;
  isVerifiedByAdmin: boolean;
  googleId?: string;
  isAdmin?: boolean;
  createdAt?: Date;
}
