import React, { useEffect, useState } from "react";
import type { ICoupon, IOffer } from "../../../types/discount";
import {
  getProductCategories,
  getProducts,
} from "../../../services/company/companyProfile";
import type { IProduct } from "../../../types/company";
import type { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import type { ProductCategory } from "../../../pages/Company/CompanyProductCategory";
import { toast } from "react-toastify";
import {
  addDiscount,
  updateDiscount,
} from "../../../services/promotionService";
import { AxiosError } from "axios";

type DiscountFormErrors = {
  offerName?: string;
  couponCode?: string;
  discountType?: string;
  discountValue?: string;
  applicableOn?: string;
  products?: string;
  categories?: string;
  maxDiscountAmount?: string;
  minOrderValue?: string;
  startDate?: string;
  endDate?: string;
};

const baseDiscountForm = {
  company: "",
  discountType: "FLAT" as const,
  discountValue: 0,
  applicableOn: "CATEGORY" as const,
  categories: [] as string[],
  products: [] as string[],
  isActive: true,
  startDate: new Date().toISOString().split("T")[0],
};

interface ProductModalProps {
  type: "offer" | "coupon";
  onClose: () => void;
  initialData?: IOffer | null | ICoupon;
}

const DiscountModal: React.FC<ProductModalProps> = ({
  type,
  onClose,
  initialData = null,
}) => {
  const [errors, setErrors] = useState<DiscountFormErrors>({});
  const [error, setError] = useState("");
  const company = useSelector((state: RootState) => state.user);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    [],
  );
  const [products, setProducts] = useState<IProduct[] | []>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<IOffer | ICoupon>(() =>
    type === "coupon"
      ? {
          ...baseDiscountForm,
          couponCode: "",
          minOrderValue: 0,
          maxDiscountAmount: 0,
        }
      : {
          ...baseDiscountForm,
          offerName: "",
        },
  );

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    const fetchCompanyProductCategories = async () => {
      const res = await getProductCategories(company._id);
      setProductCategories(res.data);
    };
    fetchCompanyProductCategories();
  }, [company._id]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts(company._id);
      console.log("product", response.products);
      setProducts(response.products);
    };
    fetchProducts();
  }, [company._id]);

  useEffect(() => {
    if (!initialData) return;

    setForm((prev) => ({
      ...prev,
      ...initialData,
      products: Array.isArray(initialData.products) ? initialData.products : [],
      categories: Array.isArray(initialData.categories)
        ? initialData.categories
        : [],
      startDate: initialData.startDate?.split("T")[0] ?? "",
      endDate: initialData.endDate?.split("T")[0] ?? "",
    }));
  }, [initialData]);

  const isEmptyArray = (arr?: string[]) => !arr || arr.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: DiscountFormErrors = {};

    if ("offerName" in form) {
      if (!form.offerName.trim())
        newErrors.offerName = "Offer name is required";
      else if (form.offerName.trim().length < 2)
        newErrors.offerName = "Offer name must be at least 2 characters";
    }

    if ("couponCode" in form) {
      if (!form.couponCode.trim())
        newErrors.couponCode = "Coupon code is required";
      else if (form.couponCode.trim().length < 3)
        newErrors.couponCode = "Coupon code must be at least 3 characters";
    }

    if (!form.discountType)
      newErrors.discountType = "Discount type is required";

    if (form.discountValue === undefined || form.discountValue === null)
      newErrors.discountValue = "Discount value is required";
    else if (form.discountValue <= 0)
      newErrors.discountValue = "Discount value must be greater than 0";
    else if (form.discountType === "PERCENTAGE" && form.discountValue > 100)
      newErrors.discountValue = "Percentage cannot exceed 100";

    if (!form.applicableOn)
      newErrors.applicableOn = "Applicable type is required";

    if (form.applicableOn === "PRODUCT" && isEmptyArray(form.products))
      newErrors.products = "Please select at least one product";

    if (form.applicableOn === "CATEGORY" && isEmptyArray(form.categories))
      newErrors.categories = "Please select at least one category";

    if ("minOrderValue" in form) {
      if (form.minOrderValue !== undefined && form.minOrderValue < 0)
        newErrors.minOrderValue = "Minimum order value cannot be negative";
    }

    if ("maxDiscountAmount" in form) {
      if (form.discountType === "PERCENTAGE") {
        if (
          form.maxDiscountAmount === undefined ||
          form.maxDiscountAmount <= 0
        ) {
          newErrors.maxDiscountAmount =
            "Max discount amount is required for percentage discount";
        }
      }
    }

    if (form.discountType === "PERCENTAGE") {
      form.discountValue = Math.min(Math.max(form.discountValue ?? 0, 1), 100);
    }

    if (form.startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate = new Date(form.startDate);
      startDate.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = "Start date cannot be before today";
      }
    }

    if (form.startDate && form.endDate) {
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (endDate < startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (form.discountType === "FLAT") {
      form.maxDiscountAmount = undefined;
    }
    try {
      if (isEditMode && initialData?._id) {
        const res = await updateDiscount(form, type, company._id);
        setError(res.message);
        onClose();
        toast.success("Updated successfully");
      } else {
        console.log("SUBMIT:", form.discountValue);
        const res = await addDiscount(form, type, company._id);
        setError(res.message);
        onClose();
        toast.success("Added successfully");
      }
    } catch (error: unknown) {
      let message = "Something went wrong";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "applicableOn") {
        return {
          ...prev,
          applicableOn: value as "PRODUCT" | "CATEGORY",
          products: value === "PRODUCT" ? (prev.products ?? []) : [],
          categories: value === "CATEGORY" ? (prev.categories ?? []) : [],
        };
      }

      return {
        ...prev,
        [name]:
          e.target.type === "number"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
      };
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleMultiSelect = (name: "categories" | "products", id: string) => {
    setForm((prev) => {
      const currentValues = (prev[name] as string[]) || [];

      return {
        ...prev,
        [name]: currentValues.includes(id)
          ? currentValues.filter((v) => v !== id)
          : [...currentValues, id],
      };
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg relative mx-auto my-10 max-h-[90vh] overflow-y-auto">
        {/* <h2 className="text-lg font-semibold mb-4 text-center">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h2> */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          {type === "offer" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Offer Name
              </label>
              <input
                type="text"
                name="offerName"
                placeholder="Enter offer name"
                value={(form as IOffer).offerName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.offerName && (
                <p className="text-red-500 text-sm mt-1">{errors.offerName}</p>
              )}
            </div>
          )}

          {type === "coupon" && (
            <>
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  name="couponCode"
                  value={(form as ICoupon).couponCode}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                {errors.couponCode && (
                  <p className="text-red-500 text-sm">{errors.couponCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={(form as ICoupon).minOrderValue}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Discount Type
            </label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Discount Type</option>
              <option value="FLAT">Flat</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>

            {errors.discountType && (
              <p className="text-red-500 text-sm mt-1">{errors.discountType}</p>
            )}
          </div>

          {form.discountType === "PERCENTAGE" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Discount Amount
              </label>
              <input
                type="number"
                name="maxDiscountAmount"
                value={form.maxDiscountAmount ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.maxDiscountAmount && (
                <p className="text-red-500 text-sm">
                  {errors.maxDiscountAmount}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Discount Value
            </label>
            <input
              type="number"
              name="discountValue"
              onWheel={(e) => e.currentTarget.blur()}
              value={form.discountValue}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.discountValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountValue}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Applicable On
            </label>
            <select
              name="applicableOn"
              value={form.applicableOn}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Applicable Type</option>
              <option value="PRODUCT">Product</option>
              <option value="CATEGORY">Category</option>
            </select>

            {errors.applicableOn && (
              <p className="text-red-500 text-sm mt-1">{errors.applicableOn}</p>
            )}
          </div>

          {form.applicableOn === "CATEGORY" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Categories
              </label>

              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
                {productCategories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.categories?.includes(cat._id) || false}
                      onChange={() => {
                        if (cat._id) {
                          handleMultiSelect("categories", cat._id);
                        }
                      }}
                      className="accent-blue-600"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>

              {errors.categories && (
                <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
              )}
            </div>
          )}

          {form.applicableOn === "PRODUCT" && (
            <div>
              <label className="block text-sm font-medium mb-2">Products</label>

              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
                {products.map((product) => (
                  <label
                    key={product._id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        !!product._id &&
                        (form.products?.includes(product._id) ?? false)
                      }
                      onChange={() => {
                        if (product._id) {
                          handleMultiSelect("products", product._id);
                        }
                      }}
                      className="accent-blue-600"
                    />
                    {product.name}
                  </label>
                ))}
              </div>

              {errors.products && (
                <p className="text-red-500 text-sm mt-1">{errors.products}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate || ""}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate || ""}
              min={form.startDate || new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

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
                : initialData
                  ? "Update"
                  : type === "coupon"
                    ? "Add Coupon"
                    : "Add Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountModal;
