import React from "react";
import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  createSubscriptionOrder,
  verifySubscriptionOrder,
} from "../../services/company/companyProfile";

const CompanySubscription: React.FC = () => {
  const company = useSelector((state: RootState) => state.user);

  const handleSubscriptionPayment = async (amount: number) => {
    try {
      const res = await createSubscriptionOrder(company._id, amount);
      const { order, key } = res;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Cyclore",
        description: "Subscription Payment",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await verifySubscriptionOrder(
              company._id,
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              amount,
            );
            toast.success("Subscription Activated!");
          } catch (error) {
            console.error("Verification failed:", error);
            toast.error("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: company?.userName,
          email: company?.email,
        },
        theme: { color: "#0C2340" },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Subscription payment failed:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading="Subscription" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col items-center justify-center px-6 py-10 w-full">
            <div className="w-full max-w-7xl">
              {/* Optional: Your Plan Section */}
              {/* 
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Plan</h2>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex justify-between items-start hover:shadow-lg transition-shadow duration-200">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">PRO</p>
                <p className="text-3xl font-bold text-gray-900">500 Rupees</p>
                <p className="text-sm text-gray-500">Every 1 Year</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  This plan price includes:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Unlimited Chats</li>
                  <li>Video call</li>
                  <li>Advance Dashboard Analytics</li>
                  <li>Catalog Management</li>
                </ul>
              </div>
            </div>
          </section> 
          */}

              <div className="border-t border-gray-200 my-8"></div>

              {/* All Plans Section */}
              <section className="px-6 py-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  All Plans
                </h2>

                <div className="flex flex-wrap gap-6 justify-start">
                  {/* CARD 1 */}
                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 pt-10 flex flex-col items-center text-center relative hover:shadow-lg transition duration-200 flex-grow min-w-[250px] max-w-[300px]">
                    <div className="absolute top-0 left-0 w-full h-3 bg-[#1F3C58] rounded-t-2xl"></div>
                    <p className="text-lg font-semibold text-[#1F3C58] mt-2">
                      Enterprise
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mt-3">
                      500 Rs
                      <span className="text-base font-medium text-gray-400">
                        {" "}
                        / Year
                      </span>
                    </p>
                    <ul className="text-gray-600 text-sm space-y-3 mt-6 mb-8 w-full">
                      {[
                        "Unlimted Chat",
                        "Video call",
                        "Dashboard Analytics",
                        "Catelog Management",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-4 h-4 flex items-center justify-center rounded-full bg-indigo-300 text-white text-xs">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSubscriptionPayment(500)}
                      className="w-full bg-[#e7f0f8] text-[#1F3C58] py-2.5 rounded-4xl font-medium hover:bg-[#1F3C58] hover:text-white transition"
                    >
                      Subscribe
                    </button>
                  </div>

                  {/* CARD 2 */}
                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 pt-10 flex flex-col items-center text-center relative hover:shadow-lg transition duration-200 flex-grow min-w-[250px] max-w-[300px]">
                    <div className="absolute top-0 left-0 w-full h-3 bg-[#1F3C58] rounded-t-2xl"></div>
                    <p className="text-lg font-semibold text-[#1F3C58] mt-2">
                      Enterprise
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mt-3">
                      500 Rs
                      <span className="text-base font-medium text-gray-400">
                        {" "}
                        / Year
                      </span>
                    </p>
                    <ul className="text-gray-600 text-sm space-y-3 mt-6 mb-8 w-full">
                      {[
                        "Unlimted Chat",
                        "Video call",
                        "Dashboard Analytics",
                        "Catelog Management",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-4 h-4 flex items-center justify-center rounded-full bg-indigo-300 text-white text-xs">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSubscriptionPayment(180)}
                      className="w-full bg-[#e7f0f8] text-[#1F3C58] py-2.5 rounded-4xl font-medium hover:bg-[#1F3C58] hover:text-white transition"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanySubscription;
