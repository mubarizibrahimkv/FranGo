import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import logo from "../../../public/logo.png";
import { useEffect, useRef, useState } from "react";
import { User, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../../redux/slice/authSlice";
import { fetchGoogleUser, logout } from "../../services/auth";
import type { RootState } from "../../redux/store/store";
import ConfirmAlert from "../CommonComponents/ConfirmationModal";

interface NavLinkItem {
  name: string;
  path: string;
}

const navLinks: NavLinkItem[] = [
  { name: "Home", path: "/" },
  { name: "Franchises", path: "/franchise" },
  { name: "Products", path: "/products" },
];

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClickedOpen, setIsClickedOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const customer = useSelector((state: RootState) => state.user);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleUser = async () => {
      try {
        const response = await fetchGoogleUser("customer");
        if (response && response.token) {
          dispatch(
            setUser({
              _id: response._id,
              userName: response.userName,
              email: response.email,
              role: response.role,
              profileImage: response.profileImage,
              isAdmin: response.isAdmin || false,
              token: response.token,
              isAuthenticated: true,
            }),
          );
        } else {
          navigate("/customer/login");
        }
      } catch (error) {
        console.log("Error fetching Google user", error);
        navigate("/customer/login");
      }
    };

    if (!customer.isAuthenticated) handleGoogleUser();
  }, [dispatch, navigate, customer.isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsClickedOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await logout(customer._id);
      if (res) {
        dispatch(logoutUser());
        setIsClickedOpen(false);
        toast.success("Logout successful");
        window.location.href = "/customer/login";
      }
    } catch (error) {
      console.log("Error in logout :", error);
      toast.error("Logout failed");
    }
  };

  const open = isHovered || isClickedOpen;

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Frango logo" className="h-6 w-auto" />
          <p className="text-xl font-serif font-bold text-[#023430]">FranGo</p>
        </div>

        {/* Nav Links */}
        <div className="flex items-center font-medium gap-6 font-sans text-gray-800">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative pb-2 ${
                  isActive ? "text-[#023430]" : "text-gray-700"
                } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                 after:h-[2px] after:w-4/6 after:bg-[#023430] after:transition-all after:duration-300 
                 ${
                   isActive
                     ? "after:opacity-100"
                     : "after:opacity-0 hover:after:opacity-100"
                 }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* ✅ Right Section */}
      {customer.isAuthenticated ? (
        <div className="flex items-center gap-4 text-gray-700 text-xl">
          <FaShoppingCart className="hover:text-[#023430] cursor-pointer" />

          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FaUserCircle
              onClick={() => setIsClickedOpen((prev) => !prev)}
              className="hover:text-[#023430] cursor-pointer"
            />

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-200 ease-in-out cursor-pointer">
                <div className="p-4 border-b">
                  <div className="font-semibold text-sm">
                    {customer.userName || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {customer.email || "Google"}
                  </div>
                </div>
                <ul className="text-sm">
                  <li>
                    <Link
                      to="/customer/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsClickedOpen(false)}
                    >
                      <User size={16} /> Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowAlert(true)}
                      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {showAlert && (
            <ConfirmAlert
              type="warning"
              title="Are you sure?"
              message="Logging out will end your current session. Do you want to proceed?"
              onClose={() => setShowAlert(false)}
              onConfirm={() => {
                handleLogout();
                setShowAlert(false);
              }}
            />
          )}
        </div>
      ) : (
        <div>
          <Link
            to="/customer/login"
            className="text-[#023430] font-semibold hover:underline text-sm"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
