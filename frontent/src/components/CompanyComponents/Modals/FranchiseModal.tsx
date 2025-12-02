import React, { useEffect, useState } from "react";
import type { IFranchise } from "../../../types/company";
import type { ISubCategory, ISubSubCategory } from "../../../types/admin";

interface FranchiseModalProps {
  isEdit?: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IFranchise>) => void;
  initialData?: Partial<IFranchise>;
  category: ISubCategory[];
}

const FranchiseModal: React.FC<FranchiseModalProps> = ({
  isEdit = false,
  onClose,
  onSubmit,
  initialData = {},
  category,
}) => {
  const [form, setForm] = useState<Partial<IFranchise>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subSubCategories, setSubSubCategories] = useState<ISubSubCategory[]>(
    [],
  );

  const [platformFeeAccepted, setPlatformFeeAccepted] = useState(false);
  const [locationInput, setLocationInput] = useState(
    (initialData?.preferedLocation as string[])?.join(", ") || "",
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    let updatedValue: any = value;

    if (type === "select-multiple") {
      const select = e.target as HTMLSelectElement;
      updatedValue = Array.from(
        select.selectedOptions,
        (option) => option.value,
      );
    }

    setForm((prev) => ({ ...prev, [name]: updatedValue }));

    // ✅ Validate this field immediately
    validateField(name, updatedValue);
  };

  const validateField = (name: string, value: any) => {
    let error = "";

    const requiredFields = [
      "franchiseName",
      "industrySubCategory",
      "minimumSpace",
      "accessibility",
      "ownershipModel",
      "agreementDuration",
    ];

    const feeFields = [
      "franchisefee",
      "advancefee",
      "royaltyfee",
      "advertisingfee",
      "renewelfee",
    ];

    if (requiredFields.includes(name)) {
      if (!value) error = "This field is required";
    }

    if (feeFields.includes(name)) {
      if (value === "" || value === undefined || value === null) {
        error = "This field is required";
      } else if (isNaN(Number(value))) {
        error = "Fee must be a number";
      } else if (Number(value) < 0) {
        error = "Fee cannot be negative";
      } else if (name === "royaltyfee" && Number(value) > 100) {
        error = "Royalty fee cannot exceed 100%";
      }
    }

    if (name === "monthlyRevenue") {
      if (value === "" || value === undefined || value === null) {
        error = "Monthly revenue is required";
      } else if (isNaN(Number(value))) {
        error = "Revenue must be a number";
      } else if (Number(value) <= 0) {
        error = "Revenue must be a positive number";
      }
    }

    if (name === "industrySubSubCategory" && (!value || value.length === 0)) {
      error = "Please select at least one Sub-Sub Category";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    if (form.industrySubCategory) {
      const selectedSub = category.find(
        (sub) => sub._id === form.industrySubCategory,
      );
      setSubSubCategories(selectedSub?.subSubCategories || []);
    }
  }, [form.industrySubCategory, category]);

  const validate = (formData: Partial<IFranchise> = form) => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "franchiseName",
      "industrySubCategory",
      "minimumSpace",
      "accessibility",
      "ownershipModel",
      "agreementDuration",
    ];

    requiredFields.forEach((field) => {
      if (!(formData as Record<string, any>)[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (
      !formData.industrySubSubCategory ||
      formData.industrySubSubCategory.length === 0
    ) {
      newErrors.industrySubSubCategory =
        "Please select at least one Sub-Sub Category";
    }

    const feeFields = [
      "franchisefee",
      "advancefee",
      "royaltyfee",
      "advertisingfee",
      "renewelfee",
      "renewelDuration",
    ];

    feeFields.forEach((field) => {
      const rawValue = (formData as Record<string, any>)[field];
      const value = Number(rawValue);

      if (rawValue === undefined || rawValue === null || rawValue === "") {
        newErrors[field] = "This field is required";
      } else if (isNaN(value)) {
        newErrors[field] = "Fee must be a number";
      } else if (value < 0) {
        newErrors[field] = "Fee cannot be negative";
      }
    });

    if (!platformFeeAccepted) {
      newErrors.platformFeeAccepted =
        "You must agree that the platform fee is 5% of the advance fee";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePlatformFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setPlatformFeeAccepted(checked);
    setErrors((prev) => ({
      ...prev,
      platformFeeAccepted: checked
        ? ""
        : "You must agree that the platform fee is 5% of the advance fee",
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Franchise" : "Create Franchise"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <hr className="mb-6" />

        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {[
            { label: "Franchise Name", name: "franchiseName", required: true },
            {
              label: "Monthly Revenue (₹)",
              name: "monthlyRevenue",
              type: "number",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={(form as Record<string, any>)[field.name] || ""}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                  errors[field.name]
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-[#1F3C58]"
                }`}
              />
              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry Sub Category <span className="text-red-500">*</span>
            </label>
            <select
              name="industrySubCategory"
              value={form.industrySubCategory || ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const selectedSubId = e.target.value;

                setForm((prev) => ({
                  ...prev,
                  industrySubCategory: selectedSubId, // store ID
                }));

                // find the selected subcategory directly from the array
                const selectedObj = category.find(
                  (sub) => sub._id === selectedSubId,
                );

                setSubSubCategories(selectedObj?.subSubCategories || []);
              }}
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.industrySubCategory
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            >
              <option value="">Select Sub Category</option>

              {category.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>

            {errors.industrySubCategory && (
              <p className="text-xs text-red-500 mt-1">
                {errors.industrySubCategory}
              </p>
            )}

            {errors.industrySubCategory && (
              <p className="text-xs text-red-500 mt-1">
                {errors.industrySubCategory}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry Sub-Sub Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {subSubCategories.map((sub) => (
                <label key={sub._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={sub._id}
                    checked={
                      form.industrySubSubCategory?.includes(sub._id) || false
                    }
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setForm((prev) => {
                        const updated = checked
                          ? [...(prev.industrySubSubCategory || []), value]
                          : prev.industrySubSubCategory?.filter(
                              (id) => id !== value,
                            ) || [];
                        return { ...prev, industrySubSubCategory: updated };
                      });
                    }}
                    className="h-4 w-4 text-[#1F3C58] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{sub.name}</span>
                </label>
              ))}
            </div>
            {errors.industrySubSubCategory && (
              <p className="text-xs text-red-500 mt-1">
                {errors.industrySubSubCategory}
              </p>
            )}
          </div>
        </div>

        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Investment & Fees
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {[
            "Franchise Fee",
            "Advance Fee",
            "Royalty Fee",
            "Advertising Fee",
            "Renewel Fee",
          ].map((label) => {
            const name = label.replace(/\s+/g, "").toLowerCase();

            const isRoyalty = label === "Royalty Fee";

            return (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    name={name}
                    value={(form as Record<string, any>)[name] || ""}
                    onChange={handleChange}
                    placeholder={
                      isRoyalty
                        ? "Enter percentage of monthly sale"
                        : `Enter ${label}`
                    }
                    className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                      errors[name]
                        ? "border-red-500 focus:ring-red-400"
                        : "focus:ring-[#1F3C58]"
                    }`}
                  />
                  {isRoyalty && (
                    <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                      %
                    </span>
                  )}
                </div>

                {errors[name] && (
                  <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
                )}
              </div>
            );
          })}
        </div>

        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Location Requirement
        </h3>
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Location Requirement
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {[
            {
              label: "Minimum Space (in sq. ft)",
              name: "minimumSpace",
              type: "number",
              required: true,
            },
            {
              label: "Prefered Type Property",
              name: "preferedProperty",
              options: ["Residential", "Commercial", "Retail", "Industrial"],
            },
            {
              label: "Prefered Locations",
              name: "preferedLocation",
              type: "array",
            },
            { label: "Accessibility", name: "accessibility", required: true },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.options ? (
                <select
                  name={field.name}
                  value={(form as Record<string, any>)[field.name] || ""}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                    errors[field.name]
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-[#1F3C58]"
                  }`}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "array" ? (
                <input
                  type="text"
                  name={field.name}
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onBlur={() => {
                    const locations = locationInput
                      .split(",")
                      .map((loc) => loc.trim())
                      .filter((loc) => loc !== "");
                    setForm((prev) => ({ ...prev, [field.name]: locations }));
                  }}
                  placeholder="Enter locations separated by commas (e.g., Kochi, Calicut, Thrissur)"
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                    errors[field.name]
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-[#1F3C58]"
                  }`}
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  min={field.type === "number" ? 1 : undefined}
                  name={field.name}
                  value={(form as Record<string, any>)[field.name] || ""}
                  onChange={handleChange}
                  placeholder={
                    field.name === "minimumSpace"
                      ? "Enter area in sq. ft"
                      : `Enter ${field.label}`
                  }
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                    errors[field.name]
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-[#1F3C58]"
                  }`}
                />
              )}

              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Operational Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {[
            {
              label: "Franchise Outlet Format",
              name: "outletFormat",
              type: "select",
              options: ["Kiosk", "Shop", "Mall", "Online", "Food Court"],
            },

            {
              label: "Ownership Model",
              name: "ownershipModel",
              required: true,
              type: "select",
              options: ["COCO", "FOFO", "COFO"],
            },
            {
              label: "Support Provided",
              name: "supportProvided",
              type: "checkbox-group",
              options: [
                "Marketing",
                "Technical",
                "HR Support",
                "Setup Assistance",
              ],
            },
            {
              label: "No of Staff Required",
              name: "staffRequired",
              type: "number",
            },
            {
              label: "Training Type",
              name: "trainingType",
              type: "select",
              options: ["Online", "Offline", "None"],
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "select" && field.options ? (
                <select
                  name={field.name}
                  value={(form as Record<string, any>)[field.name] || ""}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                    errors[field.name]
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-[#1F3C58]"
                  }`}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox-group" && field.options ? (
                <div className="flex flex-wrap gap-3">
                  {field.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        checked={
                          (form as Record<string, any>)[field.name]?.includes(
                            opt,
                          ) || false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setForm((prev) => {
                            const prevValues =
                              (prev[
                                field.name as keyof IFranchise
                              ] as string[]) || [];
                            return {
                              ...prev,
                              [field.name]: checked
                                ? [...prevValues, opt]
                                : prevValues.filter((v: string) => v !== opt),
                            };
                          });
                        }}
                        className="rounded text-[#1F3C58] focus:ring-[#1F3C58]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  min={field.type === "number" ? 1 : undefined}
                  name={field.name}
                  value={(form as Record<string, any>)[field.name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label}`}
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                    errors[field.name]
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-[#1F3C58]"
                  }`}
                />
              )}

              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Agreement Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {[
            {
              label: "Agreement Duration",
              name: "agreementDuration",
              required: true,
            },
            {
              label: "Renewal Duration",
              name: "renewelDuration",
              required: true,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  name={field.name}
                  value={(form as Record<string, any>)[field.name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label}`}
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                    errors[field.name]
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-[#1F3C58]"
                  }`}
                />
                <span className="text-gray-700 text-sm">years</span>
              </div>

              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={platformFeeAccepted}
              onChange={handlePlatformFeeChange}
              className="h-4 w-4 text-[#1F3C58] border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              Platform fee is 5% of Advance Fee
            </label>
          </div>
          {errors.platformFeeAccepted && (
            <p className="text-xs text-red-500 mt-1">
              {errors.platformFeeAccepted}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#1F3C58] text-white rounded-md text-sm hover:bg-[#254b6d]"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FranchiseModal;
