import React, { useEffect, useState } from "react";
import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  createSubscriptionOrder,
  fetchCompany,
  verifySubscriptionOrder,
} from "../../services/company/companyProfile";
import { setUser } from "../../redux/slice/authSlice";
import { Check, Crown, Sparkles } from "lucide-react";
import type { Company } from "../../types/company";

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const CompanySubscription: React.FC = () => {
  const company = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<Partial<Company>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetchCompany(company._id);
      setProfile(res.data);
      dispatch(
        setUser({
          ...company,
          isSubscribed: res.data.subscription.isActive,
        }),
      );
    };
    fetchProfile();
  }, [company._id, company, dispatch]);

  const handleSubscriptionPayment = async (amount: number) => {
    try {
      const res = await createSubscriptionOrder(company._id, amount);
      const { order, key } = res;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "FranGo",
        description: "Subscription Payment",
        order_id: order.id,
        handler: async function (response: RazorpayPaymentResponse) {
          try {
            await verifySubscriptionOrder(
              company._id,
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              amount,
            );
            dispatch(
              setUser({
                ...company,
                isSubscribed: true,
              }),
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

      const razor = new window.Razorpay(options);
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
              <div className="border-t border-gray-200 my-8"></div>

              <section className="px-6 py-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  All Plans
                </h2>

                <div className="flex flex-wrap gap-6 justify-start">
                  <div
                    className={`relative bg-white rounded-2xl shadow-lg border p-8 pt-12 flex flex-col items-center text-center transition-all duration-500 w-full max-w-sm
                    ${
                      profile.subscription?.isActive
                        ? "border-green-300 animate-pulse"
                        : "border-gray-200 hover:shadow-xl hover:-translate-y-1"
                    }`}
                  >
                    <div
                      className={`absolute top-0 left-0 w-full h-2 rounded-t-2xl ${
                        profile.subscription?.isActive
                          ? "bg-green-500"
                          : "bg-[#1F3C58]"
                      }`}
                    />

                    {profile.subscription?.isActive && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-md">
                        <Check className="w-4 h-4" />
                        Active Plan
                      </div>
                    )}

                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                        profile.subscription?.isActive
                          ? "bg-green-100"
                          : "bg-[#e7f0f8]"
                      }`}
                    >
                      {profile.subscription?.isActive ? (
                        <Crown className="w-7 h-7 text-green-600" />
                      ) : (
                        <Sparkles className="w-7 h-7 text-[#1F3C58]" />
                      )}
                    </div>

                    <p
                      className={`text-lg font-semibold ${
                        profile.subscription?.isActive
                          ? "text-green-600"
                          : "text-[#1F3C58]"
                      }`}
                    >
                      Enterprise
                    </p>

                    <div className="mt-3 mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        ₹500
                      </span>
                      <span className="text-gray-400 ml-1">/ Year</span>
                    </div>

                    <ul className="w-full space-y-3 mb-8 text-sm text-gray-600">
                      {[
                        "Unlimited Chat",
                        "Video Call",
                        "Dashboard Analytics",
                        "Product Management",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-xs ${
                              company.isSubscribed
                                ? "bg-green-500 text-white"
                                : "bg-indigo-300 text-white"
                            }`}
                          >
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {profile.subscription?.isActive ? (
                      <div className="w-full">
                        <div className="w-full bg-green-100 text-green-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                          <Check className="w-5 h-5" />
                          Subscribed
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                          Your subscription is active
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubscriptionPayment(500)}
                        className="w-full bg-[#e7f0f8] text-[#1F3C58] py-3 rounded-xl font-semibold hover:bg-[#1F3C58] hover:text-white transition-all duration-300"
                      >
                        Subscribe Now
                      </button>
                    )}
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
