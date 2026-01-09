export interface ReportResponseDTO {
  _id: string;
  reportedBy: string; 
  reportedAgainst: string;
  status: "pending" | "resolved" | "rejected";
  reason: string;
  createdAt?: Date;
  updatedAt?: Date;
}
