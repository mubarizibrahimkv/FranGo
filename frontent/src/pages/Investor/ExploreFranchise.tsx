import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { FaChartLine, FaMapMarkerAlt, FaTags } from "react-icons/fa";
import Navbar from "../../components/InvestorComponents/Navbar";
import React, { useEffect, useRef, useState } from "react";
import {
  applyAApplication,
  applyReport,
  getFranchises,
} from "../../services/invstor";
import type { IFranchise } from "../../types/company";
import { useNavigate } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa6";
import FilterPanel from "../../components/InvestorComponents/FilterPanel.";
import { Filter } from "lucide-react";
import Footer from "../../components/InvestorComponents/Footer";
import ApplyModal from "../../components/InvestorComponents/ApplyModal";
import type { Investor } from "../../types/investor";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { getProfile } from "../../services/profile";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { HiDotsVertical } from "react-icons/hi";

export interface IFilters {
  selectedCategories?: string[];
  selectedCompanies?: string[];
  selectedLocations?: string[];
  selectedOwnership?: string[];
  minFee?: string;
  maxFee?: string;
  search?: string;
}

export interface IApiParams {
  category?: string;
  company?: string;
  location?: string;
  ownership?: string;
  minFee?: string;
  maxFee?: string;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

const ExploreFranchise = () => {
  const [franchises, setFranchises] = useState<IFranchise[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("date");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const handleOrderChange = (value: "asc" | "desc") => setOrder(value);
  const [filters, setFilters] = useState<IFilters>();
  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [investor, setInvestor] = useState<Investor | {}>({});
  const investorId = useSelector((state: RootState) => state.user._id);
  const [selectedReason, setSelectedReason] = useState("");
  const investorIsAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );
  const [selectedFranchise, setSelectedFranchise] = useState<IFranchise | null>(
    null,
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedFranchiseId, setSelectedFranchiseId] =
    useState<IFranchise | null>(null);

  const handleReport = (franchise: IFranchise) => {
    console.log(franchise, "selected franchise for report");
    setSelectedFranchiseId(franchise);
    setReportModalOpen(true);
    setOpenMenuId(null);
  };

  const reportApply = async () => {
    if (!selectedReason) {
      toast.info("Please select a reason.");
      return;
    }
    if (selectedFranchiseId?._id) {
      const res = await applyReport(
        selectedFranchiseId?._id,
        investorId,
        selectedReason,
      );
      if (res.success) {
        toast.success("Thank you! Your report has been received.");
        setReportModalOpen(false);
      }
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        setIsSortModalOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterPanelOpen(false);
      }
    };
    if (isSortModalOpen || isFilterPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortModalOpen, isFilterPanelOpen]);

  useEffect(() => {
    const fetchInvestor = async () => {
      const res = await getProfile(investorId);
      console.log(res.seeker);
      setInvestor(res.seeker);
    };
    fetchInvestor();
  }, [investorId]);

  const handleApplyClick = (franchise: IFranchise) => {
    if (investorIsAuthenticated) {
      setSelectedFranchise(franchise);
    } else {
      toast.info("Please Login to continue");
    }
  };
 
  useEffect(() => {
    const fetchFranchises = async () => {
      const params = {
        category: filters?.selectedCategories?.join(","),
        company: filters?.selectedCompanies?.join(","),
        location: filters?.selectedLocations?.join(","),
        ownership: filters?.selectedOwnership?.join(","),
        minFee: filters?.minFee || "",
        maxFee: filters?.maxFee || "",
        sort: selectedSort,
        order: order,
        search: filters?.search || "",
      };

      const res = await getFranchises(params, page);

      if (res.franchises.length === 0) {
        setFranchises([]);
      } else {
        setFranchises(res.franchises);
      }

      setPage(page);
      setTotalPages(res.totalPages);
    };

    fetchFranchises();
  }, [filters, order, selectedSort, page]);

  const handleNaviagation = (id: string) => {
    navigate(`/franchise/${id}`);
  };

  const onSubmitFilter = (filters: IFilters) => {
    setFilters(filters);
    setIsFilterPanelOpen(false);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchClick = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }));
  };

  const handleApply = async (formData: Partial<Investor>) => {
    try {
      if (selectedFranchise?._id) {
        const res = await applyAApplication(
          formData as Investor,
          selectedFranchise._id,
          investorId,
        );
        if (res.success) {
          toast.success("Application applied successfully");
        } else {
          toast.error("Failed to apply for franchise");
        }
      } else {
        console.log("Didnt select franchise");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "Server error occurred";
        toast.error(message);
        console.log("Axios error:", message);
      } else if (error instanceof Error) {
        toast.error(error.message);
        console.log("Error:", error.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#0C2340] text-white text-center py-16 relative">
          <h1 className="text-3xl font-bold mb-4">
            Explore Franchise Opportunities
          </h1>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Find the right franchise for you. From food to fitness, browse
            trusted brands, check details, and apply with ease. Start your
            business journey today!
          </p>

          <div className="flex justify-center mt-6 px-4 relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-3xl overflow-visible relative">
              <div
                ref={filterRef}
                onClick={() => setIsFilterPanelOpen((prev) => !prev)}
                className="px-4 py-3 flex items-center gap-2 text-gray-700 w-30 text-sm bg-transparent outline-none border-r border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <Filter className="w-5 h-5 text-gray-500" />
                <span>Filter</span>
              </div>

              <div className="relative">
                <div
                  onClick={() => setIsSortModalOpen((prev) => !prev)}
                  className="px-4 py-3 text-gray-700 text-sm bg-transparent outline-none border-r border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  Sort by
                </div>

                {isSortModalOpen && (
                  <div
                    ref={modalRef}
                    className="absolute left-0 top-full mt-2 bg-white shadow-lg border border-gray-200 rounded-2xl p-5 w-64 z-[1000]"
                  >
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">
                      Sort Options
                    </h3>

                    <div className="space-y-3 mb-4">
                      <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer hover:text-[#023430] transition">
                        <input
                          type="radio"
                          name="sort"
                          value="date"
                          checked={selectedSort === "date"}
                          onChange={() => setSelectedSort("date")}
                          className="accent-[#023430]"
                        />
                        Date
                      </label>

                      <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer hover:text-[#023430] transition">
                        <input
                          type="radio"
                          name="sort"
                          value="revenue"
                          checked={selectedSort === "revenue"}
                          onChange={() => setSelectedSort("revenue")}
                          className="accent-[#023430]"
                        />
                        Avg Monthly Revenue
                      </label>

                      <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer hover:text-[#023430] transition">
                        <input
                          type="radio"
                          name="sort"
                          value="investment"
                          checked={selectedSort === "investment"}
                          onChange={() => setSelectedSort("investment")}
                          className="accent-[#023430]"
                        />
                        Investment
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleOrderChange("asc")}
                          className={`flex items-center justify-center gap-2 w-1/2 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                            order === "asc"
                              ? "bg-[#023430] text-white shadow-md border-[#023430]"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <ArrowUp size={16} />
                          Asc
                        </button>

                        <button
                          onClick={() => handleOrderChange("desc")}
                          className={`flex items-center justify-center gap-2 w-1/2 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                            order === "desc"
                              ? "bg-[#023430] text-white shadow-md border-[#023430]"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <ArrowDown size={16} />
                          Desc
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInput}
                placeholder="Search by company name or franchise name ..."
                className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-0"
              />

              <button
                onClick={handleSearchClick}
                className="bg-[#023430] hover:bg-[#035c4d] rounded-2xl text-white px-6 py-3 flex items-center justify-center transition-all duration-200"
              >
                <Search size={18} />
              </button>

              {isFilterPanelOpen && (
                <div
                  ref={filterRef}
                  className="absolute left-0 top-full mt-2 z-50"
                >
                  <FilterPanel
                    onClose={() => setIsFilterPanelOpen(false)}
                    onApply={onSubmitFilter}
                    appliedFilters={filters}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 px-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <span className="text-red-500 text-2xl">•</span> Recommended
            Franchises
          </h2>
          <p className="text-gray-600 mb-6">Explore franchises</p>

          {franchises.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-lg font-medium">
              No results found. Try adjusting your filters or search.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {franchises.map((franchise) => (
                <div
                  key={franchise._id}
                  className="w-[270px] rounded-[10px] border-2 bg-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center p-5 gap-2 cursor-pointer"
                >
                  <div className="absolute top-3 right-3 ">
                    <button
                      onClick={() => franchise._id && toggleMenu(franchise._id)}
                    >
                      <span className="text-xl font-bold hover:cursor-pointer">
                        <HiDotsVertical />
                      </span>
                    </button>

                    {openMenuId === franchise._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50">
                        <button
                          className="w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                          onClick={() => franchise && handleReport(franchise)}
                        >
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                  <img
                    src={franchise?.company?.companyLogo}
                    alt={franchise.franchiseName}
                    className="w-28 h-28 object-contain rounded-full mb-3 shadow-md"
                  />

                  <hr className="w-full border-t my-2" />

                  <p className="text-base font-bold text-[#023430]">
                    {franchise.franchiseName}
                  </p>

                  <div className="text-xs text-[#023430] space-y-2 text-center">
                    <p className="flex items-center justify-center gap-2">
                      <FaDollarSign />
                      Investment Range:{" "}
                      <span className="font-semibold text-[#011E2B]">
                        ₹{franchise.totalInvestement}
                      </span>
                    </p>

                    <p className="flex items-center justify-center gap-2">
                      <FaChartLine />
                      Monthly Revenue:{" "}
                      <span className="font-semibold text-[#011E2B]">
                        ₹{franchise.monthlyRevenue}
                      </span>
                    </p>

                    <p className="flex items-center justify-center gap-2">
                      <FaMapMarkerAlt />
                      Prefered Location:{" "}
                      <span className="font-semibold text-[#011E2B]">
                        {franchise.preferedLocation?.join(",")}
                      </span>
                    </p>

                    <p className="flex items-center justify-center gap-2">
                      <FaTags />
                      Category:{" "}
                      <span className="font-semibold text-[#011E2B]">
                        {franchise.company?.industryCategory?.categoryName}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() =>
                        franchise._id && handleNaviagation(franchise._id)
                      }
                      className="border border-black text-[#023430] w-28 h-10 rounded-[10px] px-3 py-1 font-semibold hover:bg-[#DBFDFA] transition-colors duration-200 text-xs"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleApplyClick(franchise)}
                      className="bg-[#1F3C58] text-white w-28 h-10 rounded-[10px] px-3 py-1 font-semibold hover:bg-[#023430] transition-colors duration-200 text-xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Report Modal */}
          {reportModalOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white p-5 rounded-md w-80 shadow-lg">
                <h2 className="text-lg font-semibold mb-3 text-[#023430]">
                  Report Company {selectedFranchiseId?.company?.companyName}
                </h2>
                <p className="text-sm text-gray-700 mb-3">Select a reason:</p>

                <div className="space-y-2">
                  {[
                    "Fake Information",
                    "Fraud / Scam",
                    "Illegal Activity",
                    "Inappropriate Content",
                    "Poor Service",
                    "Policy Violation",
                  ].map((reason) => (
                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      key={reason}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{reason}</span>
                    </label>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-5">
                  <button
                    className="px-3 py-1 text-sm rounded bg-gray-300"
                    onClick={() => setReportModalOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-3 py-1 text-sm rounded bg-[#1F3C58] text-white"
                    onClick={() => reportApply()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedFranchise && (
            <ApplyModal
              onClose={() => setSelectedFranchise(null)}
              onApply={handleApply}
              franchiseData={selectedFranchise}
              investorData={investor}
            />
          )}
        </div>

        <div className="flex justify-center mt-8 items-center gap-2 mb-4">
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
      </div>

      <Footer />
    </div>
  );
};

export default ExploreFranchise;
