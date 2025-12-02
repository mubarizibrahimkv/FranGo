import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { toast } from "react-toastify";
import { blockUsersAPI, getUsersAPI } from "../../services/admin/manageUsers";
import EntityTable from "../../components/AdminComponents/EntityTable";
import { useNavigate } from "react-router-dom";

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

  const fetchCompanies = async () => {
    try {
      const response = await getUsersAPI(role,page);
      setCompanies(response.companies);
      setPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  const blockCompany = async (companyId: string, isBlocked: boolean) => {
    try {
      const response = await blockUsersAPI(companyId, role, isBlocked);
      if (response.success) {
        toast.success(isBlocked ? "Company Blocked" : "Company Unblocked");

        setCompanies((prev) =>
          prev.map((company) =>
            company._id === companyId ? { ...company, isBlocked } : company
          )
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update company status");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar heading="Companies" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="w-full max-w-xs ml-2">{/* <SearchBar /> */}</div>

            <button
              onClick={() => navigate("/admin/pendingApproval/company")}
              className="bg-[#0C2340] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors mr-6"
            >
              Verify
            </button>
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
