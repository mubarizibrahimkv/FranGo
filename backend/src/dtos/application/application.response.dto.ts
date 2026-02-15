import { FranchiseResponseDTO } from "../franchise/franchise.response.dto";

export interface ApplicationResponseDTO {
  _id: string;
  investorId: string;
  franchiseId: string;
  franchise?:FranchiseResponseDTO
  payment: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus?: "unpaid" | "paid";
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ApplicationListDTO {
  applications: ApplicationResponseDTO[];
  totalPages: number;
} 