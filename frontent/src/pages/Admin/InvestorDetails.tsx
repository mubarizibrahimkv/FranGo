import { useEffect, useState } from "react";
import type { Investor } from "../../types/investor";
import { useParams } from "react-router-dom";
import { getInvestorDetails } from "../../services/admin/manageUsers";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { FaUser } from "react-icons/fa6";

const InvestorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<Partial<Investor>>({});

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        if (id) {
          const result = await getInvestorDetails(id);
          setUser(result.investor);
          console.log(result.investor, "invstos jhjhjjhj in details page");
          console.log(user, "invstos in details page");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message);
      }
    };
    fetchInvestor();
  }, [id, user]);

  return (
    <div className="flex h-screen bg-[#F6F6F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar heading={"Investor Details"} />

        <div className="flex-1 px-10 py-6 space-y-10 overflow-y-auto bg-[#F6F6F6]">
          <div className="flex items-center justify-between bg-white shadow-md rounded-xl p-6">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <div className="relative w-24 h-24">
                  <div className="w-full h-full bg-[#1F3C58] rounded-full flex items-center justify-center text-4xl text-white shadow-md overflow-hidden">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user?.userName}
                </h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Profile Details
              </h2>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-medium">
                <div>
                  <p className="text-gray-500 text-sm">Full Name</p>
                  {user.userName ? (
                    user.userName
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Gender</p>
                  {user.gender ? (
                    user.gender
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  {user.email ? (
                    user.email
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Date of Birth</p>
                  {user.dateOfBirth ? (
                    new Date(user.dateOfBirth).toLocaleDateString()
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Nationality</p>
                  {user.nationality ? (
                    user.nationality
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone Number</p>
                  <p>
                    {user.phoneNumber ? (
                      user.phoneNumber
                    ) : (
                      <p className="italic text-gray-400">Not provided</p>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  {user.location ? (
                    user.location
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Qualification</p>
                  {user.qualifications ? (
                    user.qualifications
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Financial Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-medium">
                <div>
                  <p className="text-gray-500 text-sm">Own Property</p>
                  {user.ownProperty ? (
                    user.ownProperty
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Floor Area</p>
                  {user.floorArea ? (
                    user.floorArea
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Investment Range</p>
                  {user.investmentRange ? (
                    user.investmentRange
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Funding Source</p>
                  {user.fundingSource ? (
                    user.fundingSource
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Business & Job Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-medium">
                <div>
                  <p className="text-gray-500 text-sm">Previous Business</p>
                  {user.previousBusiness?.length ? (
                    user.previousBusiness?.join(", ")
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Job Experience</p>
                  {user.jobExperience ? (
                    user.jobExperience
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Years of Experience</p>
                  {user.yearsOfExperience ? (
                    user.yearsOfExperience
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">No of Employees</p>
                  {user.numberOfEmployees ? (
                    user.numberOfEmployees
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Franchise Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-medium">
                <div>
                  <p className="text-gray-500 text-sm">
                    Preferred Franchise Type
                  </p>
                  {user.preferredFranchiseType?.length ? (
                    user.preferredFranchiseType?.join(", ")
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Reason for Seeking</p>
                  {user.reasonForSeeking ? (
                    user.reasonForSeeking
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Ownership Timeframe</p>
                  {user.ownershipTimeframe ? (
                    user.ownershipTimeframe
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Finding Source</p>
                  {user.findingSource ? (
                    user.findingSource
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDetails;
