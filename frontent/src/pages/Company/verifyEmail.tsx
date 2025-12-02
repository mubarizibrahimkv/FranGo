import { useEffect, useRef, useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { resendLink, verifyEmail } from "../../services/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slice/authSlice";
import type { AppDispatch } from "../../redux/store/store";

const VerifyEmailPage = () => {
  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const verifiedOnceRef = useRef(false);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { purpose: statePurpose, email: stateEmail } = location.state || {};

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const queryPurpose = params.get("purpose");
  const purpose = statePurpose || queryPurpose;
  const email = stateEmail || params.get("email");

  useEffect(() => {
    if (token && !verifiedOnceRef.current) {
      verifiedOnceRef.current = true;

      verifyEmail(token)
        .then((res) => {
          if (res.success) {
            const company = res.company.user;

            dispatch(
              setUser({
                userName: company.companyName,
                email: company.email,
                _id: company._id,
                role: company.role,
                isAdmin: company.isAdmin,
                isAuthenticated: true,
                profileImage: company.companyLogo,
              })
            );

            toast.success(res.message);

            if (purpose === "forgotPassword") {
              navigate("/changePassword", { state: { email: company.user.email,role:company.user.role } });
            } else {
              setTimeout(() => {
                navigate("/company/dashboard", {
                  state: { email: company.email },
                });
              }, 1500);
            }
          } else {
            toast.error(res.message);
            setLoading(false);
          }
        })
        .catch((err: any) => {
          toast.error(err?.response?.data?.message || "Verification failed");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token, purpose, navigate, dispatch]);

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      console.log("Resending link for:", email, purpose);
      const res = await resendLink({ email, purpose });
      if (res.success) {
        const company = res.company;
        dispatch(
          setUser({
            userName: company.companyName,
            email: company.email,
            _id: company._id,
            role: company.role,
            isAdmin: company.isAdmin,
            isAuthenticated: true,
            profileImage: company.companyLogo,
          })
        );
        toast.info("A new verification email has been sent to your inbox");
      }
    } catch (err: any) {
      console.error("Error in resend:", err);
      toast.error(err?.response?.data?.message || "Verifications failed");
    } finally {
      setIsResending(false);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-lg gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Verifying your email...
          </h2>
          <p className="text-gray-500 text-sm">
            Please wait while we verify your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-white shadow-md">
          <div className="p-8 text-center">
            <div className="relative mx-auto mb-6 w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Mail className="w-10 h-10 text-white" />
              {emailSent && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify your email
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              We&apos;ve sent a verification link to{" "}
              <span className="font-medium text-gray-900"></span>. Please check
              your inbox and click the link to verify your account.
            </p>

            {/* Instructions */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                Next steps:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                  Check your inbox for the verification email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                  Click the verification link in the email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                  Return here to continue
                </li>
              </ul>
            </div>

            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend verification email
                </>
              )}
            </button>

            {/* Help text */}
            <p className="text-xs text-gray-500 mt-6">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={handleResendEmail}
                className="text-indigo-600 hover:underline font-medium"
                disabled={isResending}
              >
                resend it
              </button>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="text-indigo-600 hover:underline font-medium transition"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
