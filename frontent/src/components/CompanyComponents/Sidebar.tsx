import React, { useState } from "react";
import logo from "../../../public/logo.png";
import {
  Home,
  FileText,
  Building2,
  Video,
  Mail,
  LogOut,
  PlusCircle,
  Tag,
  Gift,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";
import { logout } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slice/authSlice";
import ConfirmAlert from "../CommonComponents/ConfirmationModal";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  route: string;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: Home, route: "/company/dashboard" },
  { name: "Applications", icon: FileText, route: "/company/application" },
  { name: "My Franchises", icon: Building2, route: "/company/franchise" },
  { name: "Meeting", icon: Video, route: "/company/meeting" },
  { name: "Messages", icon: Mail, route: "/company/message" },
  { name: "Create Product", icon: PlusCircle, route: "/company/product" },
  { name: "Offer", icon: Tag, route: "/company/offer" },
  { name: "Coupon", icon: Gift, route: "/company/coupon" },
  { name: "Category", icon: Layers, route: "/company/category" },
  { name: "Subscription", icon: Layers, route: "/company/subscription" },
];
const Sidebar: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const company = useSelector((state: RootState) => state.user);
  const companyId = company._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const logoutCompany = async () => {
    try {
      const res = await logout(companyId);
      if (res) {
        dispatch(logoutUser());
        toast.success(res.message);
        setTimeout(() => {
          navigate("/company/login", { replace: true });
        }, 500);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <aside className="w-64 h-screen bg-[#1F3C58] text-white flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b border-gray-700">
        <img
          src={logo}
          alt="FranGo Logo"
          className="w-10 h-10 rounded-full shadow-md"
        />
        <span className="text-xl font-bold tracking-wide text-white">
          FranGo
        </span>
      </div>

      <nav className="flex-1 mt-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.route;

            return (
              <li key={item.name} className="flex justify-center">
                <div
                  className={`w-[85%] px-4 py-2 cursor-pointer rounded-md flex items-center space-x-2 text-sm transition-colors
            ${isActive ? "bg-[#4DA8DA] font-semibold" : "hover:bg-[#4DA8DA]"}`}
                  onClick={() => navigate(item.route)} // ← navigate on click
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

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
              logoutCompany();
              setShowAlert(false);
            }}
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
