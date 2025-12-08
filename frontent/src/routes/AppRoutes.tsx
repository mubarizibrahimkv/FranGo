import { ClipLoader } from "react-spinners";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const VerifyOtp = lazy(() => import("../pages/Investor/verify-otp"));
const Register = lazy(() => import("../pages/Investor/Register"));
const InvestorLogin = lazy(() => import("../pages/Investor/Login"));
const CompanyLogin = lazy(() => import("../pages/Company/companyLogin"));
const CustomerLogin = lazy(() => import("../pages/Customer/CustomerLogin"));
const Home = lazy(() => import("../pages/Investor/Home"));
const Profile = lazy(() => import("../pages/Investor/Profile"));
const CompanyRegister = lazy(() => import("../pages/Company/companyRegister"));
const CompanyDashboard = lazy(
  () => import("../pages/Company/companyDashboard"),
);
const VerifyEmail = lazy(() => import("../pages/Company/verifyEmail"));
const CompnayProfile = lazy(() => import("../pages/Company/companyProfile"));
const CustomerHome = lazy(() => import("../pages/Customer/Home"));
const CustomerRegister = lazy(
  () => import("../pages/Customer/CustomerRegister"),
);
const ChangePassword = lazy(() => import("../pages/Investor/ChangePassword"));
const CustomerProfile = lazy(() => import("../pages/Customer/CustomerProfile"));
const ForgotPassword = lazy(() => import("../pages/Investor/ForgotPassword"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));
const AdminCompany = lazy(() => import("../pages/Admin/AdminCompanies"));
const AdminInvestor = lazy(() => import("../pages/Admin/AdminInvestors"));
const AdminCustomer = lazy(() => import("../pages/Admin/AdminCustomers"));
const AdminPendingApproval = lazy(
  () => import("../pages/Admin/AdminPendingApprovals"),
);
const AdminCompanyDetails = lazy(() => import("../pages/Admin/CompanyDetails"));
const AdminInvestorDetails = lazy(
  () => import("../pages/Admin/InvestorDetails"),
);
const CompanyFranchises = lazy(
  () => import("../pages/Company/companyFranchises"),
);
const AdminIndustryCategory = lazy(
  () => import("../pages/Admin/AdminCategory"),
);
const CompanyFranchiseDetails = lazy(
  () => import("../pages/Company/companyFranchiseDetails"),
);
const ExploreFranchises = lazy(
  () => import("../pages/Investor/ExploreFranchise"),
);
const CompanyDetails = lazy(() => import("../pages/Investor/CompanyDetails"));
const CompanyApplications = lazy(
  () => import("../pages/Company/companyApplications"),
);
const InvestorApplication = lazy(
  () => import("../pages/Investor/MyApplication"),
);
const CompanyProductCategory = lazy(
  () => import("../pages/Company/CompanyProductCategory"),
);
const CompanyProducts = lazy(() => import("../pages/Company/CompanyProducts"));
const CompanySubscription = lazy(
  () => import("../pages/Company/companySubscription"),
);
const AdminLogin = lazy(() => import("../pages/Admin/AdminLogin"));
const AdminReportManagement = lazy(
  () => import("../pages/Admin/AdminReportManagement"),
);
const CompanyChats = lazy(() => import("../pages/Company/companyChats"));
const InvestorChats = lazy(() => import("../pages/Investor/Messages"));
const InvestorMyFranchises = lazy(
  () => import("../pages/Investor/MyFranchises"),
);

const AppRoutes = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <ClipLoader size={50} color="#023430" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/investor/login" element={<InvestorLogin />} />
          <Route path="/explore" element={<ExploreFranchises />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/company/verifyEmail" element={<VerifyEmail />} />
          <Route path="/franchise/:id" element={<CompanyDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["company"]} />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/franchise" element={<CompanyFranchises />} />
            <Route
              path="/company/franchise/:id"
              element={<CompanyFranchiseDetails />}
            />
            <Route path="/company/profile" element={<CompnayProfile />} />
            <Route
              path="/company/application"
              element={<CompanyApplications />}
            />
            <Route
              path="/company/category"
              element={<CompanyProductCategory />}
            />
            <Route path="/company/product" element={<CompanyProducts />} />
            <Route
              path="/company/subscription"
              element={<CompanySubscription />}
            />
            <Route path="/company/message" element={<CompanyChats />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["investor"]} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/applications" element={<InvestorApplication />} />
            <Route path="/messages" element={<InvestorChats />} />
            <Route path="/franchises" element={<InvestorMyFranchises />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/companies" element={<AdminCompany />} />
            <Route
              path="/admin/company/:id"
              element={<AdminCompanyDetails />}
            />
            <Route path="/admin/investors" element={<AdminInvestor />} />
            <Route
              path="/admin/investor/:id"
              element={<AdminInvestorDetails />}
            />
            <Route path="/admin/customers" element={<AdminCustomer />} />
            <Route
              path="/admin/industry-category"
              element={<AdminIndustryCategory />}
            />
            <Route
              path="/admin/pendingApproval/:role"
              element={<AdminPendingApproval />}
            />
            <Route path="/admin/reports" element={<AdminReportManagement />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
