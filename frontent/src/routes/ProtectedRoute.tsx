import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  allowedRoles: Array<"customer" | "company" | "investor">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role, token, isAdmin } = useSelector(
    (state: RootState) => state.user,
  );
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isAuthenticated || !token) {
        toast.info("Unauthorized. Please login");
        navigate("/customer/login", {
          replace: true,
          state: { from: location.pathname },
        });
        setCheckingAuth(false);
        return;
      }

      const hasAccess =
        isAdmin ||
        (allowedRoles &&
          allowedRoles.includes(role as "customer" | "investor" | "company"));

      if (!hasAccess) {
        toast.info("Access denied for your role");
        navigate("/customer/unauthorized", { replace: true });
      }

      setCheckingAuth(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, token, role, isAdmin, allowedRoles, navigate, location]);

  if (checkingAuth) {
    return <div className="text-center mt-10">Checking authorization...</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
