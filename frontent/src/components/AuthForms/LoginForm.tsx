import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { googleLogin, loginApi } from "../../services/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slice/authSlice";
import RegisterChoiceModal from "../CommonComponents/RegisterChoiceModal";

export interface LoginFormType {
  email: string;
  password: string;
}

interface LoginFormProps {
  role: "customer" | "investor" | "company" | "admin";
}

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const [formData, setFormData] = useState<LoginFormType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormType>>({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = (): boolean => {
    const newErrors: Partial<LoginFormType> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const user = await loginApi(formData.email, formData.password, role);
      console.log("new user in after login ", user);
      dispatch(
        setUser({
          userName: user.userName || user.companyName,
          email: user.email,
          _id: user._id,
          role: user.role,
          isAuthenticated: true,
          isAdmin: user.isAdmin,
          isSubscribed:
            user.subscription && user.subscription.isActive
              ? user.subscription.isActive
              : false,
          status: user.status || "pending",
          profileImage: user.companyLogo,
        }),
      );
      if (user.isAdmin) {
        navigate("/admin/dashboard");
        return;
      }
      if (role === "investor") {
        toast.success("Login Successfully Completed");
        navigate("/");
      } else if (role === "company") {
        toast.success("Login Successsfully Completed");
        navigate("/company/dashboard");
      } else {
        toast.success("Login Successsfully Completed");
        navigate("/customer");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="w-1/2 p-7">
      <h2 className="text-2xl font-semibold text-start">Welcome Back</h2>
      <h6 className="text-sm text-gray-500 mb-4 font-serif">
        Welcome Back ! Please enter your details
      </h6>
      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            name="email"
            onChange={handleChange}
            value={formData.email}
            type="email"
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}
        </div>
        <Link
          to={"/forgot-password"}
          state={{ role }}
          className="text-end hover:cursor-pointer"
        >
          Forgot password?
        </Link>

        <div className="flex justify-between px-15 gap-4 mt-9">
          <button
            onClick={() => googleLogin(role)}
            type="button"
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
            Log in
          </button>
        </div>
      </form>
      <h6 className="text-gray-500 text-center mt-3.5">
        Don't have account?
        <span
          onClick={() => setShowModal(true)}
          className="text-[#023430] font-semibold ml-1 cursor-pointer"
        >
          Register
        </span>
      </h6>
      {showModal && (
        <RegisterChoiceModal onClose={() => setShowModal(false)} />
      )}{" "}
    </div>
  );
};

export default LoginForm;
