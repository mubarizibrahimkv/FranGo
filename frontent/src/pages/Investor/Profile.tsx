import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/InvestorComponents/Footer";
import Navbar from "../../components/InvestorComponents/Navbar";
import { FaUser, FaCamera } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  changePassword,
  getProfile,
  reApply,
  updateProfile,
  updateProfileImage,
} from "../../services/profile";
import { toast } from "react-toastify";
import type { Investor } from "../../types/investor";
import ProfileEditModal from "../../components/InvestorComponents/investorModals/ProfileEditModal";
import { setUser } from "../../redux/slice/authSlice";
import { AxiosError } from "axios";
import ChangePasswordModal from "../../components/CommonComponents/ChangePasswordModal";

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const seeker = useSelector((state: RootState) => state.user);
  const seekerId = seeker._id;
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<Partial<Investor>>({});
  const [reload, setReload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]); 

  const handlePasswordChange = async (oldPass: string, newPass: string) => {
    try {
      const data = { oldPassword: oldPass, newPassword: newPass };
      const res = await changePassword("investor", seekerId, data);
      if (res.success) {
        setShowChangePassModal(false);
        toast.success("Password Changed Successfully");
      }
    } catch (error: unknown) {
      const message =
        (error instanceof AxiosError && error.response?.data?.message) ||
        (error instanceof Error && error.message) ||
        "Something went wrong";

      toast.error(message);
    }
  };

  const handleSave = async (updatedData: Partial<Investor>) => {
    try {
      setProfile(updatedData);
      if (profile) {
        const data = await updateProfile(updatedData, seekerId);
        if (data) {
          toast.success("Profile Updated Successfully");
        }
      }
    } catch (error: unknown) {
      const message =
        (error instanceof AxiosError && error.response?.data?.message) ||
        (error instanceof Error && error.message) ||
        "Something went wrong";

      toast.error(message);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.info("Please Select a File First");
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const res = await updateProfileImage(formData, seekerId);

      if (res && res.profileImage) {
        setProfile((prev) => ({ ...prev, profileImage: res.profileImage }));
        dispatch(setUser({ profileImage: res.profileImage }));
      }

      if (res) {
        toast.success("Image updated successfully!");
        setPreview(null);
        setReload((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(seekerId);
        setProfile(response.seeker);
        setCategories(response.industryCategory);
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.dismiss();
          toast.error(
            err.response?.data?.message || "Unauthorized. Please login again.",
          );
        } else {
          toast.error((err as Error).message);
        }
      }
    };
    fetchProfile();
  }, [seekerId, reload]);

  const handleReapply = async (investorId: string) => {
    try {
      const response = await reApply(investorId);
      if (response.success) {
        setReload((prev) => !prev);
        toast.success("Reapplied successfully");
      }
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-6xl pt-10 px-6 lg:px-12 space-y-10 bg-[#F6F6F6] min-h-screen">
        <div className="flex items-center justify-between bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="relative w-24 h-24">
                <div className="w-full h-full bg-[#1F3C58] rounded-full flex items-center justify-center text-4xl text-white shadow-md overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />

                <button
                  type="button"
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <FaCamera className="text-[#1F3C58]" />
                </button>
              </div>

              {preview && (
                <button
                  type="button"
                  className="p-1 rounded-full shadow-md transition"
                  onClick={handleUpload}
                >
                  <TiTick size={20} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {profile?.userName}
              </h2>
              <p className="text-gray-500">{profile?.email}</p>

              <span
                className={`inline-block px-5 py-1 rounded-full text-sm font-semibold text-center ${
                  profile.status === "approve"
                    ? "bg-green-100 text-green-700"
                    : profile.status === "reject"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {profile?.status
                  ? profile.status.charAt(0).toUpperCase() +
                    profile.status.slice(1)
                  : "Pending"}
              </span>

              {profile?.status === "reject" && (
                <button
                  onClick={() => profile._id && handleReapply(profile._id)}
                  className="mt-1 px-3 py-1 text-sm font-semibold text-white bg-[#0C2340] rounded-lg hover:bg-[#1E3A8A] transition"
                >
                  Reapply
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowChangePassModal(true)}
            className="px-5 py-2 bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#3B91C3] transition"
          >
            Change Password
          </button>

          {showChangePassModal && (
            <ChangePasswordModal
              onClose={() => setShowChangePassModal(false)}
              onSubmit={handlePasswordChange}
            />
          )}
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 space-y-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Profile Details
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#3B91C3] transition"
            >
              Edit
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-medium">
              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                {profile.userName ? (
                  profile.userName
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Gender</p>
                {profile.gender ? (
                  profile.gender
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                {profile.email ? (
                  profile.email
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Date of Birth</p>
                {profile.dateOfBirth ? (
                  new Date(profile.dateOfBirth).toLocaleDateString()
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Nationality</p>
                {profile.nationality ? (
                  profile.nationality
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone Number</p>
                <p>
                  {profile.phoneNumber ? (
                    profile.phoneNumber
                  ) : (
                    <p className="italic text-gray-400">Not provided</p>
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Location</p>
                {profile.location ? (
                  profile.location
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Qualification</p>
                {profile.qualifications ? (
                  profile.qualifications
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
                {profile.ownProperty ? (
                  profile.ownProperty
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Floor Area</p>
                {profile.floorArea ? (
                  profile.floorArea
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Investment Range</p>
                {profile.investmentRange ? (
                  profile.investmentRange
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Funding Source</p>
                {profile.fundingSource ? (
                  profile.fundingSource
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
                {profile.previousBusiness?.length ? (
                  profile.previousBusiness?.join(", ")
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Job Experience</p>
                {profile.jobExperience ? (
                  profile.jobExperience
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Years of Experience</p>
                {profile.yearsOfExperience ? (
                  profile.yearsOfExperience
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">No of Employees</p>
                {profile.numberOfEmployees ? (
                  profile.numberOfEmployees
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
                {profile.preferredFranchiseType?.length ? (
                  profile.preferredFranchiseType?.join(", ")
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Reason for Seeking</p>
                {profile.reasonForSeeking ? (
                  profile.reasonForSeeking
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Ownership Timeframe</p>
                {profile.ownershipTimeframe ? (
                  profile.ownershipTimeframe
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Finding Source</p>
                {profile.findingSource ? (
                  profile.findingSource
                ) : (
                  <p className="italic text-gray-400">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={profile}
          onSave={handleSave}
          categories={categories}
        />
      </div>

      <Footer />
    </>
  );
};

export default Profile;
