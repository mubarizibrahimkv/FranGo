import React, { useState, useEffect } from "react";
import type { IIndustryCategory } from "../../../types/admin";

interface SubSubCategory {
  _id?: string;
  name: string;
}

interface SubCategory {
  _id?: string;
  name: string;
  subSubCategories: SubSubCategory[];
}

interface ProductCategoryModalProps {
  industryCategories?: IIndustryCategory;
  onClose: () => void;
  onSubmit: (data: {
    industryCategoryId: string;
    subCategoryId: string;
    subSubCategoryId: string;
    productCategoryName: string;
  }) => void;
  error?: string;
}

const ProductCategoryModal: React.FC<ProductCategoryModalProps> = ({
  industryCategories,
  onClose,
  onSubmit,
  error,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    industryCategories?._id || ""
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] =
    useState<string>("");
  const [productCategoryName, setProductCategoryName] = useState<string>("");

  const [availableSubCategories, setAvailableSubCategories] = useState<
    SubCategory[]
  >(industryCategories?.subCategories || []);
  const [availableSubSubCategories, setAvailableSubSubCategories] = useState<
    SubSubCategory[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productCategoryList, setProductCategoryList] = useState<string[]>([]);

  useEffect(() => {
    const selectedSub = availableSubCategories.find(
      (sub) => sub._id === selectedSubCategory
    );
    setAvailableSubSubCategories(
      selectedSub ? selectedSub.subSubCategories : []
    );
    setSelectedSubSubCategory("");
  }, [selectedSubCategory, availableSubCategories]);

  useEffect(() => {
    const selectedSub = availableSubCategories.find(
      (sub) => sub._id === selectedSubCategory
    );
    setAvailableSubSubCategories(
      selectedSub ? selectedSub.subSubCategories : []
    );
    setSelectedSubSubCategory("");
  }, [selectedSubCategory, availableSubCategories]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedSubCategory)
      newErrors.subCategory = "Please select a subcategory";
    if (!selectedSubSubCategory)
      newErrors.subSubCategory = "Please select a sub-subcategory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setErrors(errors);
    if (productCategoryList.length === 0) {
      setErrors((prev) => ({
        ...prev,
        productCategoryName: "Please add at least one category name",
      }));
      return;
    }

    onSubmit({
      industryCategoryId: selectedIndustry,
      subCategoryId: selectedSubCategory,
      subSubCategoryId: selectedSubSubCategory,
      productCategoryName: productCategoryList.join(","),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Create Product Category
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={!availableSubCategories.length}
            >
              <option value="">Select Sub Category</option>
              {availableSubCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subCategory && (
              <p className="text-xs text-red-500 mt-1">{errors.subCategory}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Sub Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
              value={selectedSubSubCategory}
              onChange={(e) => setSelectedSubSubCategory(e.target.value)}
              disabled={!availableSubSubCategories.length}
            >
              <option value="">Select Sub-Sub Category</option>
              {availableSubSubCategories.map((subsub) => (
                <option key={subsub._id} value={subsub._id}>
                  {subsub.name}
                </option>
              ))}
            </select>
            {errors.subSubCategory && (
              <p className="text-xs text-red-500 mt-1">
                {errors.subSubCategory}
              </p>
            )}
          </div>

          {/* Product Category Name (Multiple) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Category Names <span className="text-red-500">*</span>
            </label>

            {/* Input + Add button */}
            <div className="flex gap-2">
              <input
                type="text"
                value={productCategoryName}
                onChange={(e) => setProductCategoryName(e.target.value)}
                placeholder="Enter Product Category Name"
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!productCategoryName.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      productCategoryName: "Please enter product category name",
                    }));
                    return;
                  }
                  setErrors((prev) => ({ ...prev, productCategoryName: "" }));
                  setProductCategoryList((prev) => [
                    ...prev,
                    productCategoryName.trim(),
                  ]);
                  setProductCategoryName("");
                }}
                className="bg-[#0C2340] text-white px-4 py-2 rounded-md hover:bg-[#1A365D]"
              >
                Add
              </button>
            </div>

            {/* Show error */}
            {errors.productCategoryName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.productCategoryName}
              </p>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            {/* Show list of added categories */}
            <div className="mt-3 flex flex-wrap gap-2">
              {productCategoryList.map((cat, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() =>
                      setProductCategoryList((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryModal;
