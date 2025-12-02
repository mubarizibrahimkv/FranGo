import React from "react";
import type { IAddress } from "../../../types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addressSchema, type AddressFormData } from "../../../validation/zod";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IAddress) => void;
  initialData?: {} | null;
}
const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      fullName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
      isDefault: false,
    },
  });

  if (!isOpen) return null;

  const submitHandler = (newAddress: AddressFormData) => {
    onSubmit(newAddress);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("fullName")}
                placeholder="Full Name"
                className="w-full border rounded-lg p-2"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phoneNumber")}
                placeholder="Phone Number"
                className="w-full border rounded-lg p-2"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                {...register("city")}
                placeholder="City"
                className="w-full border rounded-lg p-2"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                {...register("state")}
                placeholder="State"
                className="w-full border rounded-lg p-2"
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                {...register("pinCode")}
                placeholder="Pincode"
                className="w-full border rounded-lg p-2"
              />
              {errors.pinCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pinCode.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                {...register("country")}
                placeholder="Country"
                className="w-full border rounded-lg p-2"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("address")}
              placeholder="Address"
              className="w-full border rounded-lg p-2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("isDefault")} />
            <span>Set as default</span>
          </label> */}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
