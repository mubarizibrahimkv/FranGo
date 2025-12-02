import { useEffect, useState } from "react";
import type { Company } from "../../types/company";
import { useParams } from "react-router-dom";
import { getCompanyDetails } from "../../services/admin/manageUsers";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { FaUser } from "react-icons/fa6";

const CompanyDetails = () => {
  const [user, setUser] = useState<Company>({
    _id: new Date().getTime() as unknown as any,
  });
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        if (id) {
          const result = await getCompanyDetails(id);
          setUser(result.company);
        }
      } catch (err: any) {
        const errMsg =
          err?.response?.data?.message || err.message || "Something went wrong";
        toast.error(errMsg);
      }
    };
    fetchInvestor();
  }, []);

  return (
    <div className="flex h-screen bg-[#F6F6F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col ">
        <AdminNavbar heading="Company Details" />

        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto mb-6 flex justify-center">
          <div className="w-full max-w-3xl space-y-6">
            <div className="bg-white shadow rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative w-32 h-32 bg-[#1F3C58] rounded-full flex items-center justify-center text-4xl text-white shadow-md overflow-visible">
                  {user.companyLogo ? (
                    <img
                      src={user.companyLogo}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUser className="text-5xl" />
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{user.companyName}</h1>
                  <p className="text-sm text-gray-600">
                    Owned by : {user.ownerName||"Not Provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">About</h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {user.about||"Not Provided"}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Business Profile</h2>
                </div>
                <hr />
                <br />

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Brand Name</p>
                    <p className="text-black font-medium">{user.brandName||"Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Company Name</p>
                    <p className="text-black font-medium">{user.companyName||"Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Industry Category</p>
                    <p className="text-black font-medium">
                      {user.industryCategory||"Not Provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Industry Sub Category</p>
                    <p className="text-black font-medium">
                      {user.industrySubCategory||"Not Provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Year Founded</p>
                    <p className="text-black font-medium">{user.yearFounded||"Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Country</p>
                    <p className="text-black font-medium">{user.country||"Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Year Commenced Franchising</p>
                    <p className="text-black font-medium">
                      {user.yearCommencedFranchising||"Not Provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <hr />
                <br />
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Contact Person Name</p>
                    <p className="text-black font-medium">
                      {user.contactPerson||"Not Provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Designation</p>
                    <p className="text-black font-medium">{user.designation||"Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-black font-medium">{user.email||"Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone Number</p>
                    <p className="text-black font-medium">{user.phoneNumber||"Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Website</p>
                    <p className="text-black font-medium">{user.website||"Not Provided"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Franchise & Retail Information
                </h2>
                <hr />
                <br />
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Number of Retail Outlets</p>
                    <p className="text-black font-medium">
                      {user.numberOfRetailOutlets?.toString().trim()
                        ? user.numberOfRetailOutlets
                        : "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Number of Franchise Outlets</p>
                    <p className="text-black font-medium">
                      {user.numberOfFranchiseOutlets?.toString().trim()
                        ? user.numberOfFranchiseOutlets
                        : "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Manager (Franchise) Name</p>
                    <p className="text-black font-medium">
                      {user.franchiseManager?.trim()
                        ? user.franchiseManager
                        : "Not Provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Legal & Compliance
                </h2>
                <hr />
                <br />
                <div>
                  <p className="text-gray-500">Company Registration Proof</p>
                  {user.companyRegistrationProof ? (
                    <a
                      href={user.companyRegistrationProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDetails;
