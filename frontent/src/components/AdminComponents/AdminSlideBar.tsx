import React, { useState } from "react";
import logo from "../../../public/logo.png";
import {
  Home,
  FileText,
  Building2,
  User,
  LogOut,
  Users,
  Layers,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slice/authSlice";
import { logout } from "../../services/auth";
import ConfirmAlert from "../CommonComponents/ConfirmationModal";
import type { RootState } from "../../redux/store/store";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  route: string;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: Home, route: "/admin/dashboard" },
  { name: "Customers", icon: Users, route: "/admin/customers" },
  { name: "Companies", icon: Building2, route: "/admin/companies" },
  { name: "Investors", icon: User, route: "/admin/investors" },
  { name: "Report Management", icon: FileText, route: "/admin/reports" },
  { name: "Subscription", icon: Tag, route: "/admin/subscription" },
  {
    name: "Industry Category",
    icon: Layers,
    route: "/admin/industry-category",
  },
  {
    name: "Product Category",
    icon: Layers,
    route: "/admin/productCategory",
  },
];

const AdminSidebar: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const admin = useSelector((state: RootState) => state.user);
  const adminId = admin._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const logoutAdmin = async () => {
    try {
      const res = await logout(adminId);
      if (res) {
        dispatch(logoutUser());
        navigate("/customer/login");
      }
      toast.success(res.message);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? // @ts-ignore
            error.response?.data?.message || "Something went wrong"
          : "Something went wrong";

      toast.error(errorMessage);
    }
  };

  return (
    <aside className="w-64 h-screen bg-[#0C2340] text-white flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b border-gray-700">
        <img
          src={logo}
          alt="FranGo Logo"
          className="w-10 h-10 rounded-full shadow-md"
        />
        <span className="text-xl font-bold tracking-wide text-white">
          FranGo{" "}
        </span>
      </div>

      <nav className="flex-1 mt-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.route);

            return (
              <li key={item.name} className="flex justify-center">
                <div
                  onClick={() => item.route && navigate(item.route)}
                  className={`w-[85%] px-4 py-2 cursor-pointer rounded-md flex items-center space-x-2 text-sm transition-colors
              ${
                isActive
                  ? "bg-[#4DA8DA] font-semibold text-white"
                  : "hover:bg-[#4DA8DA] hover:text-white"
              }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="mb-3 space-y-1">
        <div
          className="w-[85%] mx-auto px-4 py-2 cursor-pointer rounded-md flex items-center space-x-2 text-sm hover:bg-[#4DA8DA] transition-colors"
          onClick={() => setShowAlert(true)}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </div>

        {showAlert && (
          <ConfirmAlert
            type="warning"
            title="Are you sure?"
            message="Logging out will end your current session. Do you want to proceed?"
            onClose={() => setShowAlert(false)}
            onConfirm={() => {
              logoutAdmin();
              setShowAlert(false);
            }}
          />
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
