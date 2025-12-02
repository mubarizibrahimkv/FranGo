import React, { useEffect, useState } from "react";
import type { Company } from "../../../types/company";
import type { IIndustryCategory } from "../../../types/admin";

interface ModalProps {
  onClose: () => void;
  initialData?: Partial<Company>;
  onSave: (data: Partial<Company>) => void;
  categories: IIndustryCategory[];
}

const ProfileEditModal: React.FC<ModalProps> = ({
  onClose,
  initialData,
  onSave,
  categories,
}) => {
  const [form, setForm] = useState<Partial<Company>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const requiredFields: { name: keyof Partial<Company>; label: string }[] = [
    { name: "brandName", label: "Brand Name" },
    { name: "companyName", label: "Company Name" },
    { name: "ownerName", label: "Owener Name" },
    { name: "industryCategory", label: "Industry Category" },
    { name: "yearFounded", label: "Year Founded" },
    { name: "country", label: "Country" },
    { name: "yearCommencedFranchising", label: "Year Commenced Franchising" },
    { name: "contactPerson", label: "Contact Person" },
    { name: "designation", label: "Designation" },
    { name: "phoneNumber", label: "Phone Number" },
    { name: "about", label: "About Company" },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const currentYear = new Date().getFullYear();

    requiredFields.forEach((field) => {
      const value = form[field.name];
      if (
        value === undefined ||
        value === null ||
        value.toString().trim() === ""
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (form.phoneNumber && !/^\+?\d{7,15}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (form.yearFounded && Number(form.yearFounded) > currentYear) {
      newErrors.yearFounded = "Year Founded cannot be in the future";
    }

    if (
      form.yearCommencedFranchising &&
      Number(form.yearCommencedFranchising) > currentYear
    ) {
      newErrors.yearCommencedFranchising =
        "Year Commenced Franchising cannot be in the future";
    }

    if (
      form.numberOfRetailOutlets != null &&
      Number(form.numberOfRetailOutlets) < 0
    ) {
      newErrors.numberOfRetailOutlets = "Cannot be negative";
    }

    if (
      form.numberOfFranchiseOutlets != null &&
      Number(form.numberOfFranchiseOutlets) < 0
    ) {
      newErrors.numberOfFranchiseOutlets = "Cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : "") : value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Company Profile
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
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brandName"
              value={form.brandName || ""}
              onChange={handleChange}
              placeholder="Enter Brand Name"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.brandName
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.brandName && (
              <p className="text-xs text-red-500 mt-1">{errors.brandName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={form.companyName || ""}
              onChange={handleChange}
              placeholder="Enter Company Name"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.companyName
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.companyName && (
              <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ownerName"
              value={form.ownerName || ""}
              onChange={handleChange}
              placeholder="Enter Owner Name"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.ownerName
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.ownerName && (
              <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry Category <span className="text-red-500">*</span>
            </label>

            <select
              name="industryCategory"
              value={
                typeof form.industryCategory === "object"
                  ? form.industryCategory._id
                  : form.industryCategory || ""
              }
              onChange={(e) => {
                const selectedId = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  industryCategory: selectedId,
                  industrySubCategory: "",
                }));
              }}
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.industryCategory
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            >
              <option value="">Select Industry Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>

            {errors.industryCategory && (
              <p className="text-xs text-red-500 mt-1">
                {errors.industryCategory}
              </p>
            )}
          </div>
          {/* 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry Sub Category <span className="text-red-500">*</span>
            </label>

            <select
              name="industrySubCategory"
              value={form.industrySubCategory || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  industrySubCategory: e.target.value,
                }))
              }
              disabled={!subCategories.length}
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.industrySubCategory
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            >
              <option value="">
                {subCategories.length
                  ? "Select Sub Category"
                  : "Select a category first"}
              </option>

              {subCategories.map((sub, index) => (
                <option key={index} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>

            {errors.industrySubCategory && (
              <p className="text-xs text-red-500 mt-1">
                {errors.industrySubCategory}
              </p>
            )}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Founded <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="yearFounded"
              value={form.yearFounded || ""}
              onChange={handleChange}
              placeholder="1990"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.yearFounded
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.yearFounded && (
              <p className="text-xs text-red-500 mt-1">{errors.yearFounded}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={form.country || ""}
              onChange={handleChange}
              placeholder="India"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.country
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.country && (
              <p className="text-xs text-red-500 mt-1">{errors.country}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Commenced Franchising <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="yearCommencedFranchising"
              value={form.yearCommencedFranchising || ""}
              onChange={handleChange}
              placeholder="2000"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.yearCommencedFranchising
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.yearCommencedFranchising && (
              <p className="text-xs text-red-500 mt-1">
                {errors.yearCommencedFranchising}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson || ""}
              onChange={handleChange}
              placeholder="Paulo Maldini"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.contactPerson
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.contactPerson && (
              <p className="text-xs text-red-500 mt-1">
                {errors.contactPerson}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="designation"
              value={form.designation || ""}
              onChange={handleChange}
              placeholder="Manager"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.designation
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.designation && (
              <p className="text-xs text-red-500 mt-1">{errors.designation}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber || ""}
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
              Website <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="website"
              value={form.website || ""}
              onChange={handleChange}
              placeholder="www.example.com"
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.website
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-[#1F3C58]"
              }`}
            />
            {errors.website && (
              <p className="text-xs text-red-500 mt-1">{errors.website}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Retail Outlets
            </label>
            <input
              type="number"
              name="numberOfRetailOutlets"
              value={form.numberOfRetailOutlets}
              onChange={handleChange}
              placeholder="0"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Franchise Outlets
            </label>
            <input
              type="number"
              name="numberOfFranchiseOutlets"
              value={form.numberOfFranchiseOutlets}
              onChange={handleChange}
              placeholder="0"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager (Franchise) Name
            </label>
            <input
              type="text"
              name="franchiseManager"
              value={form.franchiseManager || ""}
              onChange={handleChange}
              placeholder="Not Provided"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Company <span className="text-red-500">*</span>
            </label>
            <textarea
              name="about"
              value={form.about || ""}
              onChange={handleTextareaChange}
              placeholder="Write a brief description about the company"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58] resize-none h-24"
            />
            {errors.about && (
              <p className="text-xs text-red-500 mt-1">{errors.about}</p>
            )}
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

export default ProfileEditModal;
