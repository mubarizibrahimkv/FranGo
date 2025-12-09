import logo from "../../../public/logo.png";
import { LuMessageSquareText } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, LogInIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { logoutUser, setUser } from "../../redux/slice/authSlice";
import AuthChoiceModal from "../CommonComponents/AuthChoiceModal";
import { fetchGoogleUser, logout } from "../../services/auth";
import { toast } from "react-toastify";
import ConfirmAlert from "../CommonComponents/ConfirmationModal";
import VerificationBanner from "../CommonComponents/VerificationBadge";

interface NavLinkItem {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClickedOpen, setIsClickedOpen] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const investor = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleUser = async () => {
      try {
        const response = await fetchGoogleUser("investor");
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
        }
      } catch (error) {
        console.log("Error fetching Google user", error);
        navigate("/investor/login");
      }
    };

    if (!investor.isAuthenticated) handleGoogleUser();
  }, [dispatch, navigate, investor.isAuthenticated]);

  const openLoginModale = () => {
    setIsOpenLoginModal(true);
  };
  const closeLoginModale = () => {
    setIsOpenLoginModal(false);
  };

  const seeker = useSelector((state: RootState) => state.user);

  const navLinks: NavLinkItem[] = [
    { name: "Home", path: "/" },
    { name: "Explore Franchises", path: "/explore" },
    { name: "About Us", path: "/about" },
    { name: "My Applications", path: "/applications" },
    { name: "My Franchises", path: "/franchises" },
  ];

  const handleLogout = async () => {
    try {
      const res = await logout(investor._id);
      if (res) {
        dispatch(logoutUser());
        setIsClickedOpen(false);
        toast.success("Logout successfully completed");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      toast.info("Logout Failed");
    }
  };

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

  const open = isHovered || isClickedOpen;

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-2 pl-5">
          <img src={logo} alt="Frango logo" className="h-6 w-auto" />
          <p className="text-xl font-serif font-bold text-[#023430]">FranGo</p>
        </div>

        <div className="flex items-center font-medium gap-6 font-sans text-gray-800">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative pb-2 ${isActive ? "text-[#023430]" : "text-gray-700"} 
               after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
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

          {seeker.isAuthenticated && seeker.role === "investor" ? (
            <div className="flex items-center gap-4">
              <a href="/messages" className="text-gray-600 hover:text-gray-800">
                <LuMessageSquareText size={20} />
              </a>
              <a href="/" className="text-gray-600 hover:text-gray-800">
                <IoMdNotificationsOutline size={20} />
              </a>

              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <FaUserCircle
                  className="w-8 h-8 text-gray-500 cursor-pointer"
                  onClick={() => setIsClickedOpen((prev) => !prev)}
                />

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-200 ease-in-out cursor-pointer">
                    <div className="p-4 border-b">
                      <div className="font-semibold text-sm">Mubariz K.v</div>
                      <div className="text-xs text-gray-500">Google</div>
                    </div>
                    <ul className="text-sm">
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsClickedOpen(false)}
                        >
                          <User size={16} /> Profile
                        </Link>
                      </li>
                      <li>
                        <div>
                          <div
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                              setIsClickedOpen(false);
                              openLoginModale();
                            }}
                          >
                            <LogInIcon size={16} /> Login
                          </div>
                          {isOpenLoginModal && (
                            <AuthChoiceModal onClose={closeLoginModale} />
                          )}
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={() => setShowAlert(true)}
                          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </li>

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
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div
                className="flex items-center gap-2 px-4 border rounded py-1 hover:bg-gray-100 hover:cursor-pointer"
                onClick={() => {
                  setIsClickedOpen(false);
                  openLoginModale();
                }}
              >
                Login
              </div>
              {isOpenLoginModal && (
                <AuthChoiceModal onClose={closeLoginModale} />
              )}
            </div>
          )}
        </div>
      </nav>
      {seeker.isAuthenticated && <VerificationBanner status={seeker.status} />}
    </>
  );
};

export default Navbar;
