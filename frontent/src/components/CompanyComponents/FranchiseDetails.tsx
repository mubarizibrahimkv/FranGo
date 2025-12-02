import React from "react";
import type { IFranchise } from "../../types/company";

interface FranchiseDetailsProps {
  franchise: IFranchise;
}

const FranchiseDetails: React.FC<FranchiseDetailsProps> = ({ franchise }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Basic Information */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Franchise Name:</span> {franchise.franchiseName || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Industry Category:</span> {franchise.industryCategory || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Average Monthly Revenue:</span> {franchise.monthlyRevenue || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Industry Sub Category:</span> {franchise.industrySubCategory || "N/A"}
          </div>
        </div>
      </div>

      {/* Investment & Fees */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Investment & Fees</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Franchise Fee:</span> {franchise.franchisefee || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Advance Fee:</span> {franchise.advancefee || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Royalty Fee:</span> {franchise.royaltyfee || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Advertisement Fee:</span> {franchise.advertisingfee || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Total Investment:</span> {franchise.totalInvestement || "N/A"}
          </div>
        </div>
      </div>

      {/* Location Requirement */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Location Requirement</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Minimum Space:</span> {franchise.minimumSpace || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Preferred Type Property:</span> {franchise.preferedProperty || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Preferred Location:</span> {franchise.preferedLocation?.join(",") || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Accessibility:</span> {franchise.accessibility || "N/A"}
          </div>
        </div>
      </div>

      {/* Operational Details */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Operational Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Franchise Outlet Format:</span> {franchise.outletFormat || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Ownership Model:</span> {franchise.ownershipModel || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Support Provided:</span> {franchise.supportProvided || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Training Type:</span> {franchise.trainingType || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Employees Required:</span> {franchise.staffRequired || "N/A"}
          </div>
        </div>
      </div>

      {/* Agreement Details */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Agreement Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Agreement Duration:</span> {franchise.agreementDuration || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Renewal Duration:</span> {franchise.renewelDuration || "N/A"}
          </div>
        </div>
      </div>

      {/* <div>
        <h2 className="text-lg font-semibold mb-2">Contact Person</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Name:</span> {franchise.contactName || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Designation:</span> {franchise.contactDesignation || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {franchise.contactEmail || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {franchise.contactPhone || "N/A"}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default FranchiseDetails;
