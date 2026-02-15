import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import DiscountModal from "../../components/CompanyComponents/Modals/DiscountModal";
import type { ICoupon, IOffer } from "../../types/discount";
import { getDiscount } from "../../services/promotionService";
import DiscountTable from "../../components/CompanyComponents/Modals/DiscountTable";

const CompanyOffer = () => {
  const [searchText, setSearchText] = useState("");
  const [coupons, setCoupons] = useState<ICoupon[] | []>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const company = useSelector((state: RootState) => state.user);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | IOffer | null>(
    null,
  );

  const openEditModal = (discount: IOffer | ICoupon) => {
    setSelectedCoupon(discount);
    setIsOpenModal(true);
  };

  useEffect(() => {
    const fetchCoupon = async () => {
      const res = await getDiscount("coupon", company._id, page, searchText);
      setCoupons(res.coupons);
      console.log("coupons", res.coupons);
      setPage(res.currentPage);
      setTotalPages(res.totalPages);
      return;
    };
    fetchCoupon();
  }, [company._id, searchText, isOpenModal, page]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading={"Coupons"} />

        <main className="flex-1 p-6 mt-4 bg-gray-100 rounded-t-lg">
          <div className="flex mb-4 justify-between">
            <div className="w-3/4 ml-2">
              <AdminSearchBar
                onSubmit={(text: string) => setSearchText(text)}
              />
            </div>
            <button
              onClick={() => {
                setSelectedCoupon(null);
                setIsOpenModal(true);
              }}
              className="bg-[#0C2340] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors"
            >
              ADD COUPON
            </button>
          </div>
          {isOpenModal && (
            <DiscountModal
              type={"coupon"}
              onClose={() => setIsOpenModal(false)}
              initialData={selectedCoupon || undefined}
            />
          )}

          {/* filter section */}
          {/* <div className="rounded-lg shadow-sm p-3 m-4 border border-gray-100 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Industry Sub-Category
                </label>

                <div
                  onClick={() => setIsSubOpen(!isSubOpen)}
                  className="w-full flex items-center justify-between px-3 py-2
                 bg-white border border-gray-200 rounded-md text-xs cursor-pointer"
                >
                  <span className="text-gray-700 truncate">
                    {selectedSubCategory?.name || "All Sub-Categories"}
                  </span>
                  <span className="text-gray-400">▼</span>
                </div>

                {isSubOpen && (
                  <div
                    className="absolute z-20 mt-1 w-full bg-white border border-gray-200
                    rounded-md shadow max-h-48 overflow-y-auto"
                  >
                    <div
                      onClick={() => {
                        setSelectedSubCategory(undefined);
                        setIsSubOpen(false);
                      }}
                      className="px-3 py-1.5 text-xs cursor-pointer hover:bg-gray-100"
                    >
                      All Sub-Categories
                    </div>

                    {industryCategories?.subCategories.map((sub) => (
                      <div
                        key={sub._id}
                        onClick={() => {
                          setSelectedSubCategory(sub);
                          setIsSubOpen(false);
                        }}
                        className="px-3 py-1.5 text-xs cursor-pointer hover:bg-gray-100"
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Ownership Model
                </label>

                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "All", value: "" },
                    { label: "COCO", value: "COCO" },
                    { label: "FOCO", value: "FOCO" },
                    { label: "FOFO", value: "FOFO" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setOwnershipModel(item.value)}
                      className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
              ${
                ownershipModel === item.value
                  ? "bg-[#0C2340] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Total Investment
                </label>

                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "All", min: "", max: "" },
                    { label: "Below 10L", min: "0", max: "1000000" },
                    { label: "10L – 25L", min: "1000000", max: "2500000" },
                    { label: "25L – 50L", min: "2500000", max: "5000000" },
                    { label: "50L+", min: "5000000", max: "" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() =>
                        setInvestmentRange({ min: item.min, max: item.max })
                      }
                      className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
              ${
                investmentRange.min === item.min &&
                investmentRange.max === item.max
                  ? "bg-[#0C2340] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          <DiscountTable
            discounts={coupons}
            type="coupon"
            onEdit={openEditModal}
          />

          <div className="flex justify-center items-center gap-2 mb-4">
            {page > 1 && (
              <div
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                {"<"}
              </div>
            )}

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-[#0C2340] text-white" : "bg-gray-200 "
                }`}
              >
                {i + 1}
              </button>
            ))}

            {page < totalPages && (
              <div
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                {">"}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyOffer;
