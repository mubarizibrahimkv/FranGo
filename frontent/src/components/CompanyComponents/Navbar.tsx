import React, { useEffect, useState } from "react";
import { Bell, Home, UserCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGoogleUser } from "../../services/auth";
import { setUser } from "../../redux/slice/authSlice";
import type { RootState } from "../../redux/store/store";
import VerificationBanner from "../CommonComponents/VerificationBadge";
import Notification from "../CommonComponents/Notification";

interface prop {
  heading: string;
}
const Navbar: React.FC<prop> = ({ heading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const company = useSelector((state: RootState) => state.user);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const closeNotificationComponent = () => {
    setIsOpenNotification(false);
  };
  useEffect(() => {
    const handleGoogleUser = async () => {
      try {
        const response = await fetchGoogleUser("company");
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
              status: response.status,
            }),
          );
        } else {
          navigate("/company/login");
        }
      } catch (error) {
        console.log("Error fetching Google user", error);
        navigate("/company/login");
      }
    };

    if (!company.isAuthenticated) handleGoogleUser();
  }, [dispatch, navigate, company.isAuthenticated]);

  return (
    <>
      <header className="w-full h-14 flex items-center justify-between px-6 shadow-md">
        <h2 className="text-2xl font-extrabold font-serif text-gray-800">
          {heading}
        </h2>

        <div className="flex items-center space-x-6">
          <a href="/" className="p-2 text-gray-600 hover:text-gray-900">
            <Home className="w-6 h-6" />
          </a>

          <button
            onClick={() => setIsOpenNotification(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <Bell className="w-6 h-6" />
          </button>

          {isOpenNotification && (
            <Notification onClose={closeNotificationComponent} />
          )}

          <div
            onClick={() => navigate("/company/profile")}
            className="cursor-pointer rounded-full p-[2px] ring-2 ring-[#1F3C58] hover:shadow-md transition-all"
          >
            {company.profileImage ? (
              <img
                src={company.profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-700" />
            )}
          </div>
        </div>
      </header>
      <VerificationBanner status={company.status} />
    </>
  );
};

export default Navbar;
