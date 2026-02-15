import React, { useEffect, useState } from "react";
import { resendOtpApi, verifyOtp } from "../../services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slice/authSlice";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimLeft] = useState(120);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { purpose, email, role } = location.state || {};

  useEffect(() => {
    if (timeLeft === 0) {
      setOtpError("OTP expired. Please request a new one.");
      return;
    }
    const timerid = setInterval(() => {
      setTimLeft((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(timerid);
    };
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timeLeft === 0) {
      setOtpError("OTP expired. Please request a new one.");
      return;
    }

    if (!otp) {
      setOtpError("Please enter OTP");
      return;
    }
    if (otp.length < 6) {
      setOtpError("OTP must be 6 character");
      return;
    }
    try {
      setLoading(true);
      const result = await verifyOtp({ otp, email, role });
      const { user, message } = result;
      dispatch(
        setUser({
          userName: user.userName,
          email: user.email,
          _id: user._id,
          role: user.role,
          isAdmin: user.isAdmin,
          isAuthenticated: true,
        }),
      );

      toast.success(message);
      if (result) {
        if (purpose === "forgotPassword") {
          navigate("/changePassword", { state: { email, role } });
        } else {
          if (role === "customer") {
            navigate("/customer", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      }
      if (!user) {
        setOtpError("OTP verification is failed.Please try again");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const email = location.state?.email;
      const data = await resendOtpApi(email, role);
      toast.success(data.message);
      setTimLeft(120);
      setOtpError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h5 className="text-2xl font-extrabold mt-10">Verifying Email</h5>
      <p className="mt-5 mx-12 font-serif text-center">
        A 6-digit code has been sent to your email.
      </p>

      <form
        onSubmit={handleOtpVerification}
        className="flex flex-col justify-center items-center mt-10"
      >
        <p className="text-lg font-mono">{formatTime(timeLeft)}</p>
        <div>
          {otpError ? (
            <p className="text-red-600 font-light text-sm  ">{otpError}</p>
          ) : (
            ""
          )}
          <label htmlFor="otp" className="block mb-1 text-sm font-medium">
            OTP
          </label>
          <input
            type="text"
            name="otp"
            id="otp"
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter the 6-digit code"
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#023430] text-white py-2 px-4 rounded-md hover:bg-green-900"
        >
          {loading ? "...loading" : "Verify"}
        </button>
      </form>

      <div className="mt-20">
        <p
          className={`text-gray-800 cursor-pointer hover:underline ${
            timeLeft === 0
              ? "text-blue-600"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleResendOtp}
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
