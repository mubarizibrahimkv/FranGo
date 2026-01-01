import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { toast } from "react-toastify";
import { blockUsersAPI, getCategories, getUsersAPI } from "../../services/admin/manageUsers";
import EntityTable from "../../components/AdminComponents/EntityTable";
import { useNavigate } from "react-router-dom";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";
import type { IIndustryCategory } from "../../types/admin";

interface User {
  _id: string;
  companyLogo?: string;
  profileImage?: string;
  companyName?: string;
  userName?: string;
  email: string;
  phoneNo: string;
  createdAt: Date;
  isBlocked: boolean;
  role?: "investor" | "company" | "customer";
}

const AdminDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const role = "company";
    const [searchText,setSearchText]=useState("")
  const [industryCategory,setIndustryCategory]=useState<IIndustryCategory[]>([]);
    const [filter, setFilter] = useState("");


    useEffect(() => {
        const getCategory = async () => {
          const res = await getCategories();
          if(res.success){
            setIndustryCategory(res.industries)
          }
        };
    
        getCategory();
      }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getUsersAPI(role, page,searchText,filter);
      setCompanies(response.companies);
      setPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, fetchCompanies,searchText,filter]);

  const blockCompany = async (companyId: string, isBlocked: boolean) => {
    try {
      const response = await blockUsersAPI(companyId, role, isBlocked);
      if (response.success) {
        toast.success(isBlocked ? "Company Blocked" : "Company Unblocked");

        setCompanies((prev) =>
          prev.map((company) =>
            company._id === companyId ? { ...company, isBlocked } : company,
          ),
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar heading="Companies" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between gap-5 items-center mb-4">
            <div className="w-full  ml-2">
              <AdminSearchBar onSubmit={(text:string)=>setSearchText(text)}/>
            </div>

            <button
              onClick={() => navigate("/admin/pendingApproval/company")}
              className="bg-[#0C2340] text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors mr-6"
            >
              VERIFY
            </button>
          </div>

           <div className="w-full flex justify-center">
            <div className="max-w-5xl w-full px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* ================= Product Category ================= */}
                <div className="md:col-span-4 text-center">
                  <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Industry Category
                  </label>

                  <div className="flex justify-center gap-2 flex-wrap">
                    {/* All */}
                    <button
                      onClick={() => setFilter("")}
                      className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
              ${
                filter === ""
                  ? "bg-[#0C2340] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
                    >
                      All
                    </button>

                    {industryCategory?.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => setFilter(item._id ? item._id : "")}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
                ${
                  filter === item._id
                    ? "bg-[#0C2340] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                      >
                        {item.categoryName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EntityTable
            users={companies}
            onAction={blockCompany}
            actionType="block"
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

export default AdminDashboard;
