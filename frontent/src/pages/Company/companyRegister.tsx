import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import registerImage from "../../assets/compnyregister.png";
import { companySignupApi, googleLogin } from "../../services/auth";
import LoginChoiceModal from "../../components/CommonComponents/LoginChoiceModal";

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registrationProof, setRegistrationProof] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const role = "company";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    setCompanyNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setError("");

    if (
      !companyName ||
      !email ||
      !password ||
      !confirmPassword ||
      !registrationProof
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (companyName.length < 3) {
      setCompanyNameError("Company name must be at least 3 characters long");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (registrationProof)
        formData.append("registrationProof", registrationProof);
      if (companyLogo) formData.append("companyLogo", companyLogo);

      const data = await companySignupApi(formData);
      if (data.success) {
        setError("");
        navigate("/company/verifyEmail", {
          state: { email, purpose: "register" },
        });
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-[#023430] p-10 text-center">
          <h6 className="text-3xl font-bold text-white mb-3">FranGo</h6>
          <p className="text-white opacity-80 mb-8 font-serif">
            Connect with customers. Grow your franchise. <br />
            FranGo is your launchpad.
          </p>
          <img
            src={registerImage}
            alt="register"
            className="w-72 object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Company Registration
          </h2>
          <p className="text-sm text-gray-500 mb-6 font-serif">
            Please enter your details to register your company
          </p>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Company Name *
              </label>
              {companyNameError && (
                <p className="text-red-600 text-sm">{companyNameError}</p>
              )}
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023430]"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email *</label>
              {emailError && (
                <p className="text-red-600 text-sm">{emailError}</p>
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023430]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Password *
              </label>
              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023430]"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Confirm Password *
              </label>
              {confirmPasswordError && (
                <p className="text-red-600 text-sm">{confirmPasswordError}</p>
              )}
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023430]"
                placeholder="Re-enter your password"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Company Registration Proof *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setRegistrationProof(e.target.files?.[0] || null)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023430]"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Company Logo *
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setCompanyLogo(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023430]"
              />
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={() => googleLogin(role)}
                type="button"
                className="w-1/2 border rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 py-2 transition"
              >
                <FcGoogle className="w-5 h-5" /> Google
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 text-white rounded-lg bg-[#023430] hover:bg-green-900 transition"
              >
                {loading ? "Verifying..." : "Register"}
              </button>
            </div>
          </form>

          <h6 className="text-gray-500 text-center mt-5">
            You have an account?
            <span
              onClick={() => setShowLoginModal(true)}
              className="text-[#023430] font-semibold ml-1 cursor-pointer"
            >
              Log in
            </span>
          </h6>

          {showLoginModal && (
            <LoginChoiceModal onClose={() => setShowLoginModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
