import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "../../services/auth";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

const ChangePasswordComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, role } = location.state || {};
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      console.log(email, role, "email in chage passowrkd forntent");
      const res = await changePassword(email, formData.password, role);
      if (res.success) {
        if (role === "company") {
          navigate("/company/dashboard");
          toast.success("Password changed successfully!");
        } else if (role === "customer") {
          navigate("/customer");
          toast.success("Password changed successfully!");
        } else if (role === "investor") {
          navigate("/");
          toast.success("Password changed successfully!");
        }
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  return (
    <div className="p-7">
      <h2 className="text-2xl font-semibold text-start">Change Password</h2>
      <h6 className="text-sm text-gray-500 mb-4 font-serif">
        Enter your new password below
      </h6>

      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        <div>
          <label className="block mb-1 text-sm font-medium">New Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter new password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-1/2 py-2 border rounded-md hover:bg-gray-100 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 bg-[#023430] text-white rounded-md hover:bg-green-900 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordComponent;
