import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { googleLogin, signupApi } from "../../services/auth";
import { toast } from "react-toastify";
import LoginChoiceModal from "../CommonComponents/LoginChoiceModal";

interface RegisterFormProps {
  role: string;
}

const RegiserForm: React.FC<RegisterFormProps> = ({ role }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserNameError("");
    setEmailError("");
    setPasswordError("");
    // setConfirmPassword("")
    setError("");

    if (!userName && !password && !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (userName.length < 3) {
      setUserNameError("User name must be atleast 3 character long");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }
    // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || password.length < 6) {
      setPasswordError("Password must be atleast 6 character long");
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      return;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      const data = await signupApi({ userName, email, password, role });
      if (data) {
        navigate("/verify-otp", { state: { email, role } });
      } else {
        setError("Signup failed.Please try again");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="w-1/2 p-7">
      <h2 className="text-2xl font-semibold text-start">Welcome Back</h2>
      <h6 className="text-sm text-gray-500 mb-7 font-serif">
        Welcome Back ! Please enter your details
      </h6>
      {error ? <p className="text-red-600 font-light text-sm ">{error}</p> : ""}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-sm font-medium">User Name</label>
          {userNameError ? (
            <p className="text-red-600 font-light text-sm  ">{userNameError}</p>
          ) : (
            ""
          )}
          <input
            type="text"
            name="userName"
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter your user name"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email
          </label>
          {emailError ? (
            <p className="text-red-600 font-light text-sm  ">{emailError}</p>
          ) : (
            ""
          )}
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Password
          </label>
          {passwordError ? (
            <p className="text-red-600 font-light text-sm  ">{passwordError}</p>
          ) : (
            ""
          )}
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Confirm Password
          </label>
          {confirmPasswordError ? (
            <p className="text-red-600 font-light text-sm  ">
              {confirmPasswordError}
            </p>
          ) : (
            ""
          )}
          <input
            type="password"
            name="confirmPassword"
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-between px-15 gap-4 mt-6">
          <button
            onClick={() => googleLogin(role)}
            className="w-1/2 border rounded-md hover:bg-gray-100 flex items-center justify-center gap-1"
          >
            {" "}
            <FcGoogle className="w-5 h-5" />
            Google
          </button>
          <button
            type="submit"
            className="w-1/2 py-2  text-white rounded-md bg-[#023430] hover:bg-green-900 transition duration-200"
          >
            Register
          </button>
        </div>
      </form>
      <h6 className="text-gray-500 text-center mt-2">
        You have accounts?
        <div onClick={() => setShowLoginModal(true)}>
          <span className="text-[#023430] font-semibold ml-1 cursor-pointer">
            Log in
          </span>
        </div>
      </h6>
      {showLoginModal && (
        <LoginChoiceModal onClose={() => setShowLoginModal(false)} />
      )}{" "}
    </div>
  );
};

export default RegiserForm;
