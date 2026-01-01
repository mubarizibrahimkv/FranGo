import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { toast } from "react-toastify";
import { blockUsersAPI, getUsersAPI } from "../../services/admin/manageUsers";
import EntityTable from "../../components/AdminComponents/EntityTable";
import { useNavigate } from "react-router-dom";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";

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

const Investors: React.FC = () => {
  const [investors, setInvestors] = useState<User[]>([]);
  const [refresh, setRefresh] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = "investor";
  const navigate = useNavigate();
    const [searchText,setSearchText]=useState("")
  

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await getUsersAPI(role, page,searchText);
        setInvestors(response.investors);
        setPage(response.currentPage);
        setTotalPages(response.totalPages);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message);
      }
    };
    loadCompanies();
  }, [refresh, page,searchText]);

  const blockInvestor = async (investorId: string, isBlocked: boolean) => {
    try {
      const response = await blockUsersAPI(investorId, role, isBlocked);
      if (response.success) {
        setRefresh((prev) => !prev);
        toast.success(isBlocked ? "Company Blocked" : "Company Unblocked");

        setInvestors((prev) =>
          prev.map((investor) =>
            investor._id === investorId ? { ...investor, isBlocked } : investor,
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
        <AdminNavbar heading="Investors" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center gap-5 mb-4">
           <div className="w-full  ml-2">{/* <SearchBar /> */}
              <AdminSearchBar onSubmit={(text:string)=>setSearchText(text)}/>
            </div>

            <button
              onClick={() => navigate("/admin/pendingApproval/investor")}
              className="bg-[#0C2340] text-white px-5 py-3  rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors mr-6"
            >
              Verify
            </button>
          </div>

          <EntityTable
            users={investors}
            onAction={blockInvestor}
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

export default Investors;
