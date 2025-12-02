import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { useEffect, useState } from "react";
import { blockUsersAPI, getReports } from "../../services/admin/manageUsers";
import { toast } from "react-toastify";
import type { IReport } from "../../types/admin";

const AdminReportManagement = () => {
  const [reports, setReports] = useState<IReport[] | []>([]);
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        console.log(res.reports, "reports");
        setReports(res.reports);
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchReports();
  }, []);

  const blockInvestor = async (investorId: string, isBlocked: boolean) => {
    try {
      const response = await blockUsersAPI(investorId, "company", isBlocked);
      if (response.success) {
        toast.success(isBlocked ? "Company Blocked" : "Company Unblocked");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update company status");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar heading="Report Management" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">{/* <SearchBar /> */}</div>
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
                <th className="px-5 py-3 text-left font-semibold rounded-tr-lg">
                  Created At
                </th>
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
        </main>
      </div>
    </div>
  );
};

export default AdminReportManagement;
