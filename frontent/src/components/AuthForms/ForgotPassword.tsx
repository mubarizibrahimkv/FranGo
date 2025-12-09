import React, { useState } from "react";
import { toast } from "react-toastify";
import { forgotPassword, forgotPasswordCumpany } from "../../services/auth";
import { useLocation, useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const location = useLocation();
  const role = location.state?.role;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email");
        return;
      }
      if (!role) {
        setError("Please select one role");
        return;
      }
      setError("");

      let res;
      if (role === "company") {
        res = await forgotPasswordCumpany(email);
        console.log(res, "res in frontet");
      } else {
        res = await forgotPassword(email, role);
      }
      if (res.success) {
        if (role === "company") {
          navigate("/company/verifyEmail", {
            state: { purpose: "forgotPassword", email: email },
          });
        } else {
          navigate("/verify-otp", {
            state: { purpose: "forgotPassword", email: email, role },
          });
        }
      } else {
        toast.error("Failed.Please try again");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 p-7">
      <h2 className="text-2xl font-semibold text-start">Forgot Password?</h2>
      <h6 className="text-sm text-gray-500 mb-4 font-serif">
        Enter your registered email to reset your password
      </h6>

      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter your email"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <div className="flex justify-between mt-6  px-15 gap-4">
          <button
            type="button"
            // onClick={onBack}
            className="w-1/2 py-2 border rounded-md hover:bg-gray-100 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 bg-[#023430] text-white rounded-md hover:bg-green-900 transition"
          >
            {loading ? <p>Next...</p> : <p>Next</p>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
