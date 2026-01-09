import { IApplication } from "../models/applicationModel";
import { ApplicationResponseDTO } from "../dtos/application/application.response.dto";
import { Types } from "mongoose";

export class ApplicationMapper {
  static toResponse(application: IApplication): ApplicationResponseDTO {
    return {
      _id: String(application._id),

      investorId: ApplicationMapper.toId(application.investor),
      franchiseId: ApplicationMapper.toId(application.franchise),
      payment: ApplicationMapper.toId(application.payment),

      status: application.status,
      paymentStatus: application.paymentStatus,

      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  static toResponseList(applications: IApplication[]): ApplicationResponseDTO[] {
    return applications.map(this.toResponse);
  }

  private static toId(
    value?: Types.ObjectId | { _id: Types.ObjectId } | string
  ): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    if ("_id" in value) return value._id.toString();
    return String(value)
  }
}
