import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";
import { useEffect, useState } from "react";
import type { IApplication } from "../../types/company";
import {
  getApplications,
  handleApplicationStatus,
} from "../../services/company/companyProfile";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";

const CompanyApplications = () => {
  const [applications, setApplications] = useState<IApplication[] | []>([]);
  const company = useSelector((state: RootState) => state.user);
  const [reloead, setReload] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);    

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await getApplications(company._id, page);
      if (res.success) {
        console.log(res.applications, "applications asdkf");
        setApplications(res.application);
        setPage(res.currentPage);
        setTotalPages(res.totalPages);
      } else {
        toast.error(res.error);
        console.error(res.error);
      }
    };
    fetchApplications();
  }, [reloead, page]);

  const handleStatusChange = async (
    applicationId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await handleApplicationStatus(applicationId, status);
      if (res) {
        toast.success(`Application ${status}`);
        setReload((prev) => !prev);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update application status. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading={"Applications"} />

        <main className="flex-1 p-6 mt-4 bg-gray-100 rounded-t-lg">
          <div className="overflow-x-auto px-4 py-2">
            <div className="flex justify-end mb-4"></div>
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-[#0C2340] text-white text-base text-center">
                  <th className="px-5 py-3 font-semibold rounded-tl-lg">
                    Investor Email
                  </th>
                  <th className="px-5 py-3 font-semibold">Franchise Name</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Advance Amount</th>
                  <th className="px-5 py-3 font-semibold rounded-tr-lg">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="text-center">
                {applications.map((application, index) => (
                  <tr
                    key={index}
                    className="bg-white text-[13px] font-semibold hover:shadow-md transition-all"
                  >
                    <td className="px-5 py-2">
                      {application.investor?.email || "N/A"}
                    </td>
                    <td className="px-5 py-2">
                      {application.franchise?.franchiseName || "N/A"}
                    </td>
                    <td className="px-5 py-2">
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-5 py-2">
                      {application.franchise?.advancefee || "N/A"}
                    </td>
                    <td className="px-5 py-2 relative text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          type="button"
                          className={`text-xs font-semibold px-5 py-2 rounded-full ${
                            application.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {(application.status || "pending")
                            .charAt(0)
                            .toUpperCase() +
                            (application.status || "pending").slice(1)}
                        </button>

                        <button
                          type="button"
                          disabled={application.paymentStatus === "paid"}
                          className={`text-gray-600 hover:text-gray-800 text-xs flex items-center 
                          ${
                            application.paymentStatus === "paid"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === application._id
                                ? null
                                : application._id
                            )
                          }
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>

                      {openDropdownId === application._id &&
                        application.paymentStatus !== "paid" && (
                          <ul className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-[120px] bg-white border border-gray-200 rounded-md shadow-lg z-20 text-left">
                            <li
                              className="px-3 py-1 text-green-700 bg-green-50 hover:bg-green-100 cursor-pointer text-xs font-medium rounded-t-md"
                              onClick={() => {
                                handleStatusChange(application._id, "approved");
                                setOpenDropdownId(null);
                              }}
                            >
                              Approve
                            </li>
                            <li
                              className="px-3 py-1 text-red-700 bg-red-50 hover:bg-red-100 cursor-pointer text-xs font-medium rounded-b-md"
                              onClick={() => {
                                handleStatusChange(application._id, "rejected");
                                setOpenDropdownId(null);
                              }}
                            >
                              Reject
                            </li>
                          </ul>
                        )}
                    </td>

                   
                  </tr>
                ))}

                {applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No Applications available.
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

export default CompanyApplications;
