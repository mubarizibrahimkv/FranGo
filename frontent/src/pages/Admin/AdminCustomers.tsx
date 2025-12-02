import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import EntityTable from "../../components/AdminComponents/EntityTable";
import { blockUsersAPI, getUsersAPI } from "../../services/admin/manageUsers";
import { toast } from "react-toastify";

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
  const [customers, setCustomers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = "customer";

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await getUsersAPI(role, page);
        setCustomers(response.users);
        setPage(response.currentPage);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch companies");
      }
    };
    loadCompanies();
  }, [page]);

  const blockInvestor = async (investorId: string, isBlocked: boolean) => {
    try {
      const response = await blockUsersAPI(investorId, role, isBlocked);
      if (response.success) {
        toast.success(isBlocked ? "Customer Blocked" : "Customer Unblocked");

        setCustomers((prev) =>
          prev.map((customer) =>
            customer._id === investorId ? { ...customer, isBlocked } : customer
          )
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update company status");
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F6F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar heading={"Customers"} />

        <main className="flex-1 p-6 overflow-y-auto mt-6">
          <EntityTable
            users={customers}
            onAction={blockInvestor}
            actionType="block"
          />

          <div className="flex justify-center items-center gap-2 mb-4">
            {page>1&&<div
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              {"<"}
            </div>}
            

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


            {page<totalPages&&<div
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              {">"}
            </div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
