import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { IProduct } from "../../../types/company";
import type { IProductForm } from "../../../pages/Company/CompanyProducts";

interface CategoryDetails {
  industryName: string;
  subCategoryName: string;
  subSubCategoryName: string;
}

interface ProductCategory {
  _id: string;
  name: string;
  categoryDetails: CategoryDetails;
}

export interface ProductFormData {
  category: string;
  name: string;
  price: string;
  description: string;
  images: File[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: IProductForm, isEditing: boolean) => void;
  productCategories: ProductCategory[];
  initialData?: IProduct | null;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productCategories,
  initialData = null,
  isEditing = false,
  isSubmitting = false,
}) => {
  const [form, setForm] = useState<IProduct>({
    category: "",
    name: "",
    price: "",
    description: "",
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    category: "",
    name: "",
    price: "",
    description: "",
    images: "",
  });

  useEffect(() => {
    if (initialData) {
      const existingUrls = initialData.images.filter(
        (img): img is string => typeof img === "string",
      );

      setPreviewUrls(existingUrls);
      setForm({
        category: initialData.productCategory?._id || "",
        name: initialData.name || "",
        price: initialData.price?.toString() || "",
        description: initialData.description || "",
        images: [],
      });
    } else {
      setForm({
        category: "",
        name: "",
        price: "",
        description: "",
        images: [],
      });
      setPreviewUrls([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    if (previewUrls.length + newFiles.length > 3) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload a maximum of 3 images.",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));

    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!form.category) newErrors.category = "Category is required.";
    if (!form.name.trim()) newErrors.name = "Product name is required.";
    else if (form.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters.";

    if (!form.price) newErrors.price = "Price is required.";
    else if (Number(form.price) <= 0)
      newErrors.price = "Price must be a positive value.";

    if (!form.description.trim())
      newErrors.description = "Description is required.";
    else if (form.description.trim().length < 3)
      newErrors.description = "Description must be at least 3 characters.";

    if (previewUrls.length === 0)
      newErrors.images = "At least 1 image is required.";
    else if (previewUrls.length > 3)
      newErrors.images = "Maximum 3 images allowed.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const submitData = {
      ...form,
      _id: initialData?._id,
      removedImages,
    };

    onSubmit(submitData, isEditing);
  };

  const handleRemoveImage = (index: number) => {
    const removed = previewUrls[index];
    if (typeof removed === "string") {
      setRemovedImages((prev) => [...prev, removed]);
    }

    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4 text-center">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              {productCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({cat.categoryDetails.subSubCategoryName})
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Images (max 3)
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />

            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}

            {previewUrls.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 border rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0C2340] text-white rounded-lg"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
