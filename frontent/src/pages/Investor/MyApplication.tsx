import { useEffect, useState } from "react";
import Footer from "../../components/InvestorComponents/Footer";
import Navbar from "../../components/InvestorComponents/Navbar";
import {
  applyAApplication,
  deleteApplication,
  getAApplication,
  payAdvance,
  verifyPayAdvanceOrder,
} from "../../services/invstor";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import type { IApplication, IFranchise } from "../../types/company";
import { toast } from "react-toastify";
import type { Payment } from "../../types/common";
import type {
  RazorpayInstance,
  RazorpayOptions,
  RazorpayResponse,
} from "../../types/global";
import ApplyModal from "../../components/InvestorComponents/ApplyModal";
import type { Investor } from "../../types/investor";
import { AxiosError } from "axios";
import { FaTrashAlt } from "react-icons/fa";
import ConfirmAlert from "../../components/CommonComponents/ConfirmationModal";

const MyApplication = () => {
  const investor = useSelector((state: RootState) => state.user);
  const [applications, setApplications] = useState<IApplication[] | []>([]);
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFranchise, setSelectedFranchise] = useState<IFranchise | null>(
    null,
  );
  const [showAlert, setShowAlert] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");

  const handleApply = async (formData: Partial<Investor>) => {
    try {
      if (selectedFranchise?._id) {
        const res = await applyAApplication(
          formData as Investor,
          selectedFranchise._id,
          investor._id,
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

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await getAApplication(investor._id, page);
      if (res.success) {
        setApplications(res.application);
        setPage(page);
        setTotalPages(res.totalPages);
      }
    };
    fetchApplications();
  }, [reload, page, investor._id]);

  const handlePayAdvance = async (applicationId: string, amount: number) => {
    const data: Payment = {
      amount,
      type: "advance",
      method: "razorpay",
    };

    try {
      const res = await payAdvance(investor._id, applicationId, data);
      const { order, key } = res;

      const options: RazorpayOptions = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "FranGo",
        description: "Advance payment",
        order_id: order.id,

        handler: async (response: RazorpayResponse) => {
          try {
            await verifyPayAdvanceOrder(
              investor._id,
              applicationId,
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              amount,
            );

            setReload((prev) => !prev);
            toast.success("Advance is Paid!");
          } catch (error: unknown) {
            console.error("Verification failed:", error);
            toast.error("Verification failed. Please contact support.");
          }
        },

        prefill: {
          name: investor.userName,
          email: investor.email,
        },

        theme: {
          color: "#0C2340",
        },
      };

      const razor: RazorpayInstance = new window.Razorpay(options);
      razor.open();
    } catch (error: unknown) {
      console.error("Payment failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteApplication(id);
      if (response.success) {
        setSelectedApp("");
        toast.success("Application deleted successfully!");
      }
      return response;
    } catch (error) {
      console.log("Error delete application ", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6 mt-4  rounded-t-lg min-h-[80vh]">
        <div className="overflow-x-auto px-4 py-2">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-left font-serif">
            My Applications
          </h1>
          <div className="flex justify-end mb-4"></div>
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#0C2340] text-white text-base text-center">
                <th className="px-5 py-3 font-semibold rounded-tl-lg">
                  Company Name
                </th>
                <th className="px-5 py-3 font-semibold">Franchise Name</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Monthly Revenue</th>
                <th className="px-5 py-3 font-semibold">Total Investement</th>
                <th className="px-5 py-3 font-semibold">Advance</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold rounded-tr-lg">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-center">
              {applications.map((application, index) => (
                <tr
                  key={index}
                  className="bg-white text-[13px] font-semibold hover:shadow-md transition-all"
                >
                  <td className="px-5 py-3">
                    {application.franchise.company?.companyName || "N/A"}
                  </td>
                  <td className="px-5 py-3">
                    {application.franchise.franchiseName || "N/A"}
                  </td>
                  <td className="px-5 py-3">
                    {application.franchise.company?.industryCategory
                      ?.categoryName || "N/A"}
                  </td>
                  <td className="px-5 py-3">
                    {application.franchise.monthlyRevenue || "N/A"}
                  </td>
                  <td className="px-5 py-3">
                    {application.franchise.totalInvestement || "N/A"}
                  </td>
                  <td className="px-5 py-3">
                    {application.franchise.advancefee || "N/A"}
                  </td>
                  <td className="px-5 py-3 relative text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        type="button"
                        className={`text-xs font-semibold px-3 py-1 rounded ${
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
                    </div>
                  </td>

                  <td className="px-5 py-3 flex items-center justify-center gap-5">
                    {application.status === "pending" && (
                      <button
                        onClick={() => {
                          setSelectedApp(application._id);
                          setShowAlert(true);
                        }}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    )}

                    {application.status === "rejected" && (
                      <span className="text-red-600 font-medium">Rejected</span>
                    )}

                    {application.paymentStatus === "paid" && (
                      <span className="text-green-700 font-medium">Paid</span>
                    )}

                    {application.status === "approved" &&
                      application.paymentStatus !== "paid" && (
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0C2340] text-white hover:bg-[#1A365D]"
                          onClick={() =>
                            application._id &&
                            application.franchise.advancefee &&
                            handlePayAdvance(
                              application._id,
                              application.franchise.advancefee,
                            )
                          }
                        >
                          Pay Advance
                        </button>
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

        {showAlert && (
          <ConfirmAlert
            type="warning"
            title="Are you sure?"
            message="Deleting this application cannot be undone. Do you want to continue?"
            onClose={() => setShowAlert(false)}
            onConfirm={() => {
              handleDelete(selectedApp);
              setShowAlert(false);
            }}
          />
        )}

        {selectedFranchise && (
          <ApplyModal
            onClose={() => setSelectedFranchise(null)}
            onApply={handleApply}
            franchiseData={selectedFranchise}
            investorData={investor}
          />
        )}

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
      </main>
      <Footer />
    </div>
  );
};

export default MyApplication;
