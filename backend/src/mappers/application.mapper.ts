import { IApplication } from "../models/applicationModel";
import { ApplicationResponseDTO } from "../dtos/application/application.response.dto";
import { Types } from "mongoose";
import { FranchiseMapper } from "./franchise.mapper";
import { IFranchise } from "../models/franchiseModel";


export class ApplicationMapper {
  static toResponse(application: IApplication): ApplicationResponseDTO {
    return {
      _id: String(application._id),

      investorId: ApplicationMapper.toId(application.investor),
      franchiseId: ApplicationMapper.toId(application.franchise),
      franchise: this.isFranchisePopulated(application.franchise)
        ? FranchiseMapper.toResponse(application.franchise)
        : undefined,
      payment: ApplicationMapper.toId(application.payment),

      status: application.status,
      paymentStatus: application.paymentStatus, 

      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };

  }
  private static isFranchisePopulated(
    franchise: Types.ObjectId | IFranchise
  ): franchise is IFranchise {
    return typeof franchise === "object" && !(franchise instanceof Types.ObjectId);
  }

  static toResponseList(applications: IApplication[]): ApplicationResponseDTO[] {
    return applications.map(app => this.toResponse(app));
  }


  private static toId(
    value?: Types.ObjectId | { _id: Types.ObjectId } | string
  ): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    if ("_id" in value) return value._id.toString();
    return String(value);
  }
}
