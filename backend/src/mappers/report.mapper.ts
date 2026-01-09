// mappers/report.mapper.ts
import { ReportResponseDTO } from "../dtos/report/report.dto";
import { IReport } from "../models/reportModel"; // adjust path

export class ReportMapper {
  static toResponse(report: IReport): ReportResponseDTO {
    return {
      _id: report._id?.toString() || "",
      reportedBy: report.reportedBy.toString(),
      reportedAgainst: report.reportedAgainst.toString(),
      status: report.status,
      reason: report.reason,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }

  static toResponseList(reports: IReport[]): ReportResponseDTO[] {
    return reports.map(this.toResponse);
  }
}
