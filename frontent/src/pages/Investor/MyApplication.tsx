import { useEffect, useState } from "react";
import Footer from "../../components/InvestorComponents/Footer";
import Navbar from "../../components/InvestorComponents/Navbar";
import {
  getAApplication,
  payAdvance,
  verifyPayAdvanceOrder,
} from "../../services/invstor";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import type { IApplication } from "../../types/company";
import { toast } from "react-toastify";
import type { Payment } from "../../types/common";
import type {
  RazorpayInstance,
  RazorpayOptions,
  RazorpayResponse,
} from "../../types/global";

const MyApplication = () => {
  const investor = useSelector((state: RootState) => state.user);
  const [applications, setApplications] = useState<IApplication[] | []>([]);
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200
                      ${
                        application.status === "rejected"
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : application.status === "pending"
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : application.paymentStatus === "paid"
                              ? "bg-green-800 text-white cursor-default"
                              : "bg-[#0C2340] text-white hover:bg-[#1A365D]"
                      }`}
                      disabled={
                        application.status === "rejected" ||
                        application.status === "pending" ||
                        application.paymentStatus === "paid"
                      }
                      onClick={() =>
                        application._id &&
                        application.franchise.advancefee &&
                        handlePayAdvance(
                          application._id,
                          application.franchise.advancefee,
                        )
                      }
                    >
                      {application.status === "pending"
                        ? "Pending"
                        : application.status === "rejected"
                          ? "Rejected"
                          : application.paymentStatus === "paid"
                            ? "Paid"
                            : "Pay Advance"}
                    </button>
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
