import React, { useState } from "react";
import type { IFranchise } from "../../types/company";
import type { Investor } from "../../types/investor";

interface ApplyModalProps {
  investorData: Partial<Investor>;
  franchiseData: Partial<IFranchise>;
  onClose: () => void;
  onApply: (formData: Partial<Investor>) => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({
  investorData,
  franchiseData,
  onClose,
  onApply,
}) => {
  const [formData, setFormData] = useState<Partial<Investor>>(
    investorData || {},
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData?.gender) newErrors.gender = "Gender is required";

    if (!formData?.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const selectedDate = new Date(formData.dateOfBirth);
      const today = new Date();

      if (selectedDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      } else {
        const ageDiff = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        const dayDiff = today.getDate() - selectedDate.getDate();

        const age =
          monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
            ? ageDiff - 1
            : ageDiff;

        if (age < 10) {
          newErrors.dateOfBirth = "You must be at least 10 years old";
        }
      }
    }

    if (!formData?.nationality?.trim())
      newErrors.nationality = "Nationality is required";
    if (!formData?.phoneNumber?.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";

    if (!formData?.location?.trim())
      newErrors.location = "Location is required";
    if (!formData?.qualifications?.length)
      newErrors.qualifications = "Qualification is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onApply(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#0C2340] mb-6 text-center">
          Apply for Franchise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F5F7FB] rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center mb-4">
              <img
                src={franchiseData.company?.companyLogo || "/default-logo.png"}
                alt={franchiseData.company?.companyName || "Company Logo"}
                className="w-14 h-14 object-contain rounded-lg border border-gray-300 bg-white mr-3"
              />
              <h3 className="text-lg font-semibold text-[#0C2340]">
                {franchiseData.company?.companyName || "Unknown Company"}
              </h3>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              Franchise:{" "}
              <span className="font-medium text-gray-900">
                {franchiseData.franchiseName}
              </span>
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Industry:{" "}
              <span className="font-medium text-gray-900">
                {franchiseData.company?.industryCategory?.categoryName || "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Investment Required:{" "}
              <span className="font-medium text-gray-900">
                ₹{franchiseData.totalInvestement?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Ownership Model:{" "}
              <span className="font-medium text-gray-900">
                {franchiseData?.ownershipModel || "N/A"}
              </span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-inner p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#0C2340] mb-4">
              Investor Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={investorData.email}
                  readOnly
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    formData?.dateOfBirth
                      ? new Date(formData.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Enter nationality"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {errors.nationality && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.nationality}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  placeholder="Enter qualification"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {errors.qualifications && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.qualifications}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-[#0C2340] text-white hover:bg-[#12315a]"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
