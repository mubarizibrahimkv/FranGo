import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { useEffect, useState } from "react";
import { blockUsersAPI, getReports } from "../../services/admin/manageUsers";
import { toast } from "react-toastify";
import type { IReport } from "../../types/admin";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";

const AdminReportManagement = () => {
  const [reports, setReports] = useState<IReport[] | []>([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports(searchText, page);
        setPage(res.currentPage);
        setTotalPages(res.totalPages);
        setReports(res.reports);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message);
      }
    };
    fetchReports();
  }, [searchText, page]);

  const blockInvestor = async (investorId: string, isBlocked: boolean) => {
    try {
      const response = await blockUsersAPI(investorId, "company", isBlocked);

      if (response.success) {
        toast.success(isBlocked ? "Company Blocked" : "Company Unblocked");

        const res = await getReports(searchText, page);
        setReports(res.reports);
        setTotalPages(res.totalPages);
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
        <AdminNavbar heading="Report Management" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="w-3/4 ml-2">
              <AdminSearchBar
                onSubmit={(text: string) => setSearchText(text)}
              />
            </div>
          </div>

          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#0C2340] text-white text-base">
                <th className="px-5 py-3 text-left font-semibold rounded-tl-lg">
                  Reported Against
                </th>
                <th className="px-5 py-3 text-left font-semibold">
                  Reported By
                </th>
                <th className="px-5 py-3 text-left font-semibold">Reason</th>
                <th className="px-5 py-3 text-left font-semibold">Staus</th>
                <th className="px-5 py-3 text-left font-semibold ">Date</th>
                <th className="px-5 py-3 text-left font-semibold rounded-tr-lg">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {reports.length > 0 ? (
                reports.map((report, index) => (
                  <tr
                    key={index}
                    className="bg-white text-[13px] font-semibold hover:shadow-md transition-all"
                  >
                    <td className="px-5 py-2">
                      {report.reportedAgainst.companyName || "N/A"}
                    </td>

                    <td className="px-5 py-2">{report.reportedBy.userName}</td>

                    <td className="px-5 py-2">{report.reason}</td>
                    <td className="px-5 py-2">{report.status}</td>
                    <td className="px-5 py-2">
                      {report.createdAt
                        ? new Date(report.createdAt).toDateString()
                        : "N/A"}
                    </td>

                    <td className="px-5 py-2 flex items-center justify-center">
                      <button
                        className={`w-24 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                          report.reportedAgainst.isBlocked
                            ? "bg-[#0C2340]"
                            : "bg-[#0C2340] hover:bg-[#1E3A8A]"
                        }`}
                        onClick={() =>
                          report.reportedAgainst._id &&
                          blockInvestor(
                            report.reportedAgainst._id,
                            !report.reportedAgainst.isBlocked,
                          )
                        }
                      >
                        {report.reportedAgainst.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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

export default AdminReportManagement;
