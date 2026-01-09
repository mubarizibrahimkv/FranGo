import React, { useEffect, useState } from "react";
import type { Investor } from "../../../types/investor";
import type { IIndustryCategory } from "../../../types/admin";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<Investor>;
  onSave: (data: Partial<Investor>) => void;
  categories: IIndustryCategory[];
}

const PersonalInfoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  categories,
}) => {
  const [form, setForm] = useState<Partial<Investor>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form?.userName?.trim()) newErrors.userName = "Full name is required";
    if (!form?.gender) newErrors.gender = "Gender is required";

    if (!form?.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const selectedDate = new Date(form.dateOfBirth);
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

    if (!form?.nationality?.trim())
      newErrors.nationality = "Nationality is required";
    if (!form?.phoneNumber?.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[0-9]{10,15}$/.test(form.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";

    if (!form?.location?.trim()) newErrors.location = "Location is required";
    if (!form?.qualifications?.length)
      newErrors.qualifications = "Qualification is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(form);
      onClose();
      console.log("✅ Form is valid, proceed to save:", form);
    } else {
      console.log("❌ Validation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/50 via-gray-800/30 to-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <hr className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="userName"
              value={form?.userName || ""}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.userName
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.userName && (
              <p className="text-xs text-red-500 mt-1">{errors.userName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={form?.gender || ""}
              name="gender"
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.gender
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              max={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              value={
                form?.dateOfBirth
                  ? new Date(form.dateOfBirth).toISOString().split("T")[0]
                  : ""
              }
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.dateOfBirth
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nationality"
              value={form?.nationality || ""}
              onChange={handleChange}
              placeholder="Enter nationality"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.nationality
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.nationality && (
              <p className="text-xs text-red-500 mt-1">{errors.nationality}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={form?.phoneNumber || ""}
              onChange={handleChange}
              placeholder="+91-80-1234-5678"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.phoneNumber
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={form?.location || ""}
              onChange={handleChange}
              placeholder="Enter location"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.location
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="qualifications"
              value={form?.qualifications || ""}
              onChange={handleChange}
              placeholder="Enter qualification"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.qualifications
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.qualifications && (
              <p className="text-xs text-red-500 mt-1">
                {errors.qualifications}
              </p>
            )}
          </div>
        </div>

        <h3 className="mt-8 mb-2 text-md font-semibold text-gray-800">
          Financial Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Own Property
            </label>

            <select
              name="ownProperty"
              value={
                form?.ownProperty
                  ? "yes"
                  : form?.ownProperty === false
                    ? "no"
                    : ""
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  ownProperty:
                    e.target.value === "yes"
                      ? true
                      : e.target.value === "no"
                        ? false
                        : undefined,
                }))
              }
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor Area
            </label>
            <input
              type="text"
              name="floorArea"
              value={form?.floorArea || ""}
              onChange={handleChange}
              placeholder="2000 sq.ft"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Range
            </label>
            <input
              type="text"
              name="investmentRange"
              value={form?.investmentRange || ""}
              onChange={handleChange}
              placeholder="$50,000 - $100,000"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Source
            </label>
            <input
              type="text"
              name="fundingSource"
              value={form?.fundingSource || ""}
              onChange={handleChange}
              placeholder="Own"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <h3 className="mt-8 mb-2 text-md font-semibold text-gray-800">
          Business & Job Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Business
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories
                .filter((cate) => cate._id)
                .map((cate) => (
                  <label
                    key={cate._id?.toString() || cate.categoryName}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      name="previousBusiness"
                      value={cate._id?.toString() || ""}
                      checked={form?.previousBusiness?.includes(
                        cate._id?.toString() || "",
                      )}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        setForm((prev) => {
                          let updated = prev.previousBusiness || [];
                          if (checked) {
                            updated = [...updated, value];
                          } else {
                            updated = updated.filter((item) => item !== value);
                          }
                          return { ...prev, previousBusiness: updated };
                        });
                      }}
                      className="h-4 w-4 text-[#1F3C58] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {cate.categoryName}
                    </span>
                  </label>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Experience
            </label>
            <input
              type="text"
              name="jobExperience"
              value={form?.jobExperience || ""}
              onChange={handleChange}
              placeholder="Manager"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              value={form?.yearsOfExperience || ""}
              onChange={handleChange}
              placeholder="5 Years"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No of Employees
            </label>
            <input
              type="number"
              name="numberOfEmployees"
              value={form?.numberOfEmployees || ""}
              onChange={handleChange}
              placeholder="20"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <h3 className="mt-8 mb-2 text-md font-semibold text-gray-800">
          Franchise Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Franchise Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cate) => (
                <label
                  key={cate._id && cate._id.toString()}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    name="preferredFranchiseType"
                    value={cate._id && cate._id.toString()}
                    checked={form?.preferredFranchiseType?.includes(
                      cate._id?.toString() || "",
                    )}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setForm((prev) => {
                        let updated = prev.preferredFranchiseType || [];
                        if (checked) {
                          updated = [...updated, value];
                        } else {
                          updated = updated.filter((item) => item !== value);
                        }
                        return { ...prev, preferredFranchiseType: updated };
                      });
                    }}
                    className="h-4 w-4 text-[#1F3C58] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {cate.categoryName}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Seeking
            </label>
            <input
              type="text"
              name="reasonForSeeking"
              value={form?.reasonForSeeking || ""}
              onChange={handleChange}
              placeholder="Expand Business"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ownership Timeframe
            </label>
            <input
              type="text"
              name="ownershipTimeframe"
              value={form?.ownershipTimeframe || ""}
              onChange={handleChange}
              placeholder="Within 6 months"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Finding Source
            </label>
            <input
              type="text"
              name="findingSource"
              value={form?.findingSource || ""}
              onChange={handleChange}
              placeholder="Online Search"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#1F3C58] text-white rounded-md hover:bg-[#3B91C3] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoModal;
