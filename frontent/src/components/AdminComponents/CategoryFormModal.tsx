import React, { useState, type ChangeEvent } from "react";
import type { IIndustryCategory } from "../../types/admin";

interface ModalProps {
  onClose: () => void;
  onsubmit: (data: FormData) => Promise<void>;
  initialData?: IIndustryCategory;
}

const CategoryFormModal: React.FC<ModalProps> = ({
  onClose,
  onsubmit,
  initialData = { categoryName: "", subCategories: [] },
}) => {
  const [form, setForm] = useState<IIndustryCategory>(initialData);
  const [subInput, setSubInput] = useState("");
  const [subSubInput, setSubSubInput] = useState("");
  const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditMode = Boolean(initialData && initialData._id);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubCategory = () => {
    if (!subInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      subCategories: [
        ...prev.subCategories,
        { name: subInput.trim(), subSubCategories: [] },
      ],
    }));
    setSubInput("");
  };

  const handleRemoveSub = (index: number) => {
    setForm((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index),
    }));
    if (selectedSubIndex === index) setSelectedSubIndex(null);
  };

  const handleAddSubSub = () => {
    if (
      subSubInput.trim() &&
      selectedSubIndex !== null &&
      selectedSubIndex >= 0
    ) {
      setForm((prev) => {
        const updated = [...prev.subCategories];
        const selected = updated[selectedSubIndex];

        const newSubSubCategories = [
          ...selected.subSubCategories,
          { name: subSubInput.trim() },
        ];

        updated[selectedSubIndex] = {
          ...selected,
          subSubCategories: newSubSubCategories,
        };

        return { ...prev, subCategories: updated };
      });
      setSubSubInput("");
    }
  };

  const handleRemoveSubSub = (subIndex: number, itemName: string) => {
    setForm((prev) => {
      const updated = [...prev.subCategories];
      updated[subIndex].subSubCategories = updated[
        subIndex
      ].subSubCategories.filter((s) => s.name !== itemName);
      return { ...prev, subCategories: updated };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.categoryName) newErrors.categoryName = "Category name required";
    if (!form.subCategories.length)
      newErrors.subCategories = "At least one subcategory required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formData = new FormData();
    const sendData = {
      ...form,
      _id: isEditMode ? form._id : undefined,
    };

    formData.append("data", JSON.stringify(sendData));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    onsubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Category
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <label htmlFor=""></label>
          <input
            type="text"
            name="categoryName"
            value={form.categoryName}
            onChange={handleChange}
            placeholder="Enter Category Name"
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
          />
          {errors.categoryName && (
            <p className="text-xs text-red-500 mt-1">{errors.categoryName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Subcategory
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={subInput}
              onChange={(e) => setSubInput(e.target.value)}
              placeholder="Enter Subcategory"
              className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
            />
            <button
              type="button"
              onClick={handleAddSubCategory}
              className="px-3 py-2 bg-[#1F3C58] text-white rounded-md hover:bg-[#254b6d]"
            >
              Add
            </button>
          </div>
          {errors.subCategories && (
            <p className="text-xs text-red-500 mt-1">{errors.subCategories}</p>
          )}
        </div>

        <div className="mb-4 space-y-3">
          {form.subCategories.map((sub, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800">{sub.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSubIndex(index)}
                    className={`text-sm px-2 py-1 rounded ${
                      selectedSubIndex === index
                        ? "bg-[#1F3C58] text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => handleRemoveSub(index)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {selectedSubIndex === index && (
                <div className="mt-3">
                  <label className="block text-sm text-gray-600 mb-1">
                    Add Sub-Subcategory
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={subSubInput}
                      onChange={(e) => setSubSubInput(e.target.value)}
                      placeholder="Enter Sub-Subcategory"
                      className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F3C58]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubSub}
                      className="px-3 py-2 bg-[#1F3C58] text-white rounded-md hover:bg-[#254b6d]"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sub.subSubCategories.map((item) => (
                      <span
                        key={item.name}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center gap-1"
                      >
                        {item.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubSub(index, item.name)}
                          className="text-red-500 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full text-sm"
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
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
            {isEditMode ? "Edit Category" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;
