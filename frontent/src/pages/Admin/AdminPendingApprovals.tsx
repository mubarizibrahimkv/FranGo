import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import EntityTable from "../../components/AdminComponents/EntityTable";
import {
  changeStatusUsersAPI,
  getPendingUsersAPI,
} from "../../services/admin/manageUsers";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";

interface User {
  _id: string;
  companyLogo: string;
  companyName: string;
  email: string;
  phoneNo: string;
  createdAt: Date;
  isBlocked: boolean;
  isVerifiedByAdmin: boolean;
}

const AdminPendingApproval: React.FC = () => {
  const [companies, setCompanies] = useState<User[]>([]);
  const { role } = useParams<{ role: string }>();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");

  if (!role) return null;
  const fetchCompanies = async () => {
    try {
      const response = await getPendingUsersAPI(role, page, searchText);
      setCompanies(response.users);

      setPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!role) return;
    fetchCompanies();
  }, [role, page, fetchCompanies, searchText]);

  const verifyCompany = async (
    companyId: string,
    selectedAction: "reject" | "approve",
    reason?: string,
  ) => {
    try {
      const response = await changeStatusUsersAPI(
        companyId,
        role,
        selectedAction,
        reason,
      );
      if (response.success) {
        toast.success("Company Verified Successfully");
        setCompanies((prev) => prev.filter((c) => c._id !== companyId));
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
        <AdminNavbar
          heading={`Verify ${role.charAt(0).toUpperCase() + role.slice(1)}`}
        />
        <main className="flex-1 p-6 overflow-y-auto mt-10">
          <AdminSearchBar onSubmit={(text: string) => setSearchText(text)} />
          {companies.length === 0 ? (
            <p className="text-gray-600">No companies pending approval.</p>
          ) : (
            <div>
              <EntityTable
                users={companies}
                actionType="verify"
                onAction={(id, action, reason) =>
                  verifyCompany(id, action as "approve" | "reject", reason)
                }
              />
            </div>
          )}

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

export default AdminPendingApproval;
