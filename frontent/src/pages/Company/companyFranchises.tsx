import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "../../components/CompanyComponents/Navbar";
import Sidebar from "../../components/CompanyComponents/Sidebar";
import type { IFranchise } from "../../types/company";
import FranchiseModal from "../../components/CompanyComponents/Modals/FranchiseModal";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  addFranchise,
  deleteFranchise,
  editFranchise,
  getFranchise,
} from "../../services/company/companyProfile";
import { FaTrashAlt } from "react-icons/fa";
import { Edit } from "lucide-react";
import ConfirmAlert from "../../components/CommonComponents/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const CompanyFranchises: React.FC = () => {
  const [franchises, setFranchises] = useState<Partial<IFranchise>[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [category, setCategory] = useState([]);
  const company = useSelector((state: RootState) => state.user);
    const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [industryCategoryId, setIndustryCategoryId] = useState<string>("");
  const [selectedFranchise, setSelectedFranchise] = useState<IFranchise | null>(
    null
  );
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [franchiseToDelete, setFranchiseToDelete] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const handleDeleteClick = (id: string) => {
    setFranchiseToDelete(id);
    setConfirmationModal(true);
  };

  useEffect(() => {
    const getFranchises = async () => {
      try {
        const res = await getFranchise(company._id,page);
        setFranchises(res.franchises);
        setCategory(res.companyIndustryCategory.subCategories || []);
        setIndustryCategoryId(res.companyIndustryCategory._id || "");
         setPage(res.currentPage);
        setTotalPages(res.totalPages);
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.dismiss();
          toast.error(
            err.response?.data?.message || "Unauthorized. Please login again."
          );
        } else {
          toast.error((err as Error).message);
        }
      }
    };
    getFranchises();
  }, [reload,page]);  

  const handleSubmit = async (data: IFranchise) => {
    try {
      const finalData = {
        ...data,
        industryCategory: industryCategoryId,
      };

      if (data._id) {
        const result = await editFranchise(data._id, finalData);
        if (result) {
          setReload((prev) => !prev);
          toast.success("Franchise updated successfully!");
        }
      } else {
        console.log(finalData, "data while creating franchise");
        const result = await addFranchise(company._id, finalData);
        if (result) {
          setReload((prev) => !prev);
          toast.success("New Franchise Opportunity Added!");
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.dismiss();
        toast.error(
          err.response?.data?.message || "Unauthorized. Please login again."
        );
      } else {
        toast.error((err as Error).message);
      }
    }
  };

  const handleDelete = async (franchiseId: string) => {
    try {
      const result = await deleteFranchise(franchiseId);
      if (result) {
        setReload((prev) => !prev);
        toast.success("Franchise Opoortunity is deleted");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.dismiss();
        toast.error(
          err.response?.data?.message || "Unauthorized. Please login again."
        );
      } else {
        toast.error((err as Error).message);
      }
    }
  };

  const handleViewDetail = (id: string) => {
    navigate(`/company/franchise/${id}`);
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading={"Franchises"} />

        <main className="flex-1 p-6 mt-4 bg-gray-100 rounded-t-lg">
          <div className="overflow-x-auto px-4 py-2">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setSelectedFranchise(null);
                  setIsOpenModal(true);
                }}
                className="bg-[#0C2340] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors"
              >
                ADD
              </button>
            </div>
            {isOpenModal && (
              <FranchiseModal
                isEdit={false}
                onClose={() => setIsOpenModal(false)}
                onSubmit={handleSubmit}
                category={category}
                initialData={selectedFranchise || undefined}
              />
            )}
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-[#0C2340] text-white text-base text-center">
                  <th className="px-5 py-3 font-semibold rounded-tl-lg">
                    Name
                  </th>
                  <th className="px-5 py-3 font-semibold">Total Fee</th>
                  <th className="px-5 py-3 font-semibold">Ownership Model</th>
                  <th className="px-5 py-3 font-semibold">
                    Avg Monthly Revenue
                  </th>
                  <th className="px-5 py-3 font-semibold rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-center">
                {franchises.map((franchise, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      franchise._id && handleViewDetail(franchise._id)
                    }
                    className="bg-white text-[13px] font-semibold hover:shadow-md transition-all"
                  >
                    <td className="px-5 py-2">
                      {franchise.franchiseName || "N/A"}
                    </td>
                    <td className="px-5 py-2">
                      {franchise.franchisefee || "N/A"}
                    </td>
                    <td className="px-5 py-2">
                      {franchise.ownershipModel || "N/A"}
                    </td>
                    <td className="px-5 py-2">
                      {franchise.monthlyRevenue || "N/A"}
                    </td>
                    <td className="px-5 py-2 flex items-center justify-center gap-5">
                      <button className="text-red-400 hover:underline cursor-pointer">
                        <FaTrashAlt
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(franchise._id!);
                          }}
                        />
                      </button>
                      <Edit
                        size={18}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFranchise(franchise);
                          setIsOpenModal(true);
                        }}
                        className="text-green-400 hover:underline cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
                {confirmationModal && franchiseToDelete && (
                  <ConfirmAlert
                    type="warning"
                    title="Delete Confirmation"
                    message="Do you really want to delete this franchise record?"
                    onClose={() => {
                      setConfirmationModal(false);
                      setFranchiseToDelete(null);
                    }}
                    onConfirm={async () => {
                      await handleDelete(franchiseToDelete);
                      setConfirmationModal(false);
                      setFranchiseToDelete(null);
                    }}
                  />
                )}

                {franchises.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No franchises available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

export default CompanyFranchises;
