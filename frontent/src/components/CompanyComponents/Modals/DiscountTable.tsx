import { Edit } from "lucide-react";
import type { ICoupon, IOffer } from "../../../types/discount";
import ConfirmAlert from "../../CommonComponents/ConfirmationModal";
import { FaTrashAlt } from "react-icons/fa";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { deleteDiscount } from "../../../services/promotionService";
import { formatDate } from "../../../utils/formatTimeStamp";
import { AxiosError } from "axios";

const isOffer = (d: IOffer | ICoupon): d is IOffer => {
  return "offerName" in d;
};

const isCoupon = (d: IOffer | ICoupon): d is ICoupon => {
  return "couponCode" in d;
};

interface ProductTableProps {
  type: "offer" | "coupon";
  discounts: IOffer[] | ICoupon[];
  onEdit: (discount: IOffer | ICoupon) => void;
}
const DiscountTable: React.FC<ProductTableProps> = ({
  type,
  discounts,
  onEdit,
}) => {
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<
    IOffer | ICoupon | null
  >(null);

  const handleDelete = async (discount: IOffer | ICoupon) => {
    try {
      if (discount._id) {
        const result = await deleteDiscount(
          type,
          discount.company,
          discount._id,
        );
        if (result) {
          toast.success("Discount is deleted");
        }
      }
    } catch (error: unknown) {
      let message = "Something went wrong";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    }
  };

  const handleDeleteClick = (discount: IOffer | ICoupon) => {
    setDiscountToDelete(discount);
    setConfirmationModal(true);
  };

  return (
    <table className="min-w-full border-separate border-spacing-y-2">
      <thead>
        <tr className="bg-[#0C2340] text-white text-base text-center">
          <th className="px-5 py-3 font-semibold rounded-tl-lg">
            {type === "coupon" ? "Coupon Code" : "Offer Name"}
          </th>
          <th className="px-5 py-3 font-semibold">Discount Type</th>
          <th className="px-5 py-3 font-semibold">Discount Value</th>
          <th className="px-5 py-3 font-semibold">Applicable On</th>
          <th className="px-5 py-3 font-semibold">Items</th>
          {type === "coupon" && (
            <th className="px-5 py-3 font-semibold">Min Order Value</th>
          )}
          <th className="px-5 py-3 font-semibold">Max Discount Amount</th>
          <th className="px-5 py-3 font-semibold">Start Date</th>
          <th className="px-5 py-3 font-semibold">End Date</th>
          <th className="px-5 py-3 font-semibold rounded-tr-lg">Actions</th>
        </tr>
      </thead>

      <tbody className="text-center">
        {discounts.map((discount, index) => (
          <tr
            key={index}
            className="bg-white text-[13px] font-semibold hover:shadow-md transition-all"
          >
            <td className="px-5 py-2">
              {isOffer(discount) ? discount.offerName : discount.couponCode}
            </td>
            <td className="px-5 py-2">{discount.discountType || "N/A"}</td>
            <td className="px-5 py-2">{discount.discountValue || "N/A"}</td>
            <td className="px-5 py-2">{discount.applicableOn || "N/A"}</td>
            <td className="px-5 py-2">
              {discount.applicableOn === "PRODUCT"
                ? (discount.products?.length ?? 0)
                : (discount.categories?.length ?? 0)}
            </td>
            {type === "coupon" && isCoupon(discount) && (
              <>
                <td className="px-5 py-2">{discount.minOrderValue ?? "—"}</td>
              </>
            )}
            <td className="px-5 py-2">{discount.maxDiscountAmount ?? "—"}</td>
            <td className="px-5 py-2">{formatDate(discount.startDate)}</td>
            <td className="px-5 py-2">{formatDate(discount.endDate)}</td>

            <td className="px-5 py-2 flex items-center justify-center gap-5">
              <Edit
                size={18}
                onClick={() => onEdit(discount)}
                className="text-green-400 hover:underline cursor-pointer"
              />
              <button className="text-red-400 hover:underline cursor-pointer">
                <FaTrashAlt
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(discount);
                  }}
                />
              </button>
            </td>
          </tr>
        ))}

        {confirmationModal && discountToDelete && (
          <ConfirmAlert
            type="warning"
            title="Delete Confirmation"
            message="Do you really want to delete this offer?"
            onClose={() => {
              setConfirmationModal(false);
              setDiscountToDelete(null);
            }}
            onConfirm={async () => {
              await handleDelete(discountToDelete);
              setConfirmationModal(false);
              setDiscountToDelete(null);
            }}
          />
        )}

        {discounts.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center py-4 text-gray-500">
              No Discounts available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DiscountTable;
