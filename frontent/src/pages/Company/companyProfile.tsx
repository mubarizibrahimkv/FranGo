import { Pencil } from "lucide-react";
import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";
import { FaUser, FaCamera } from "react-icons/fa6";
import React, { useEffect, useRef, useState } from "react";
import { TiTick } from "react-icons/ti";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  changeLogo,
  editProfile,
  fetchCompany,
  reApply,
} from "../../services/company/companyProfile";
import { AxiosError } from "axios";
import type { Company } from "../../types/company";
import ProfileEditForm from "../../components/CompanyComponents/Modals/ProfileEditForm";
import ChangePasswordModal from "../../components/CommonComponents/ChangePasswordModal";
import { changePassword } from "../../services/profile";
import { getCategories } from "../../services/admin/manageUsers";
import type { IIndustryCategory } from "../../types/admin";

export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const company = useSelector((state: RootState) => state.user);
  const [profile, setProfile] = useState<Partial<Company>>({});
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const companyId = company._id;
  const [reload, setReload] = useState(false);
  const [categories, setCategories] = useState<IIndustryCategory[]>([]);

  const handlePasswordChange = async (oldPass: string, newPass: string) => {
    try {
      const data = { oldPassword: oldPass, newPassword: newPass };
      const res = await changePassword("company", companyId, data);
      if (res.success) {
        setShowChangePassModal(false);
        toast.success("Password Changed Successfully");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const getCategory = async () => {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.industries);
      }
    };
    getCategory();
  }, [reload]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchCompany(companyId);
        setProfile(res.data);
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
  }, [companyId, reload]);

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
    setIsUploading(true);
    if (!file) {
      toast.info("Please Select a File First");
      return;
    }

    const formData = new FormData();
    formData.append("companyLogo", file);

    try {
      const res = await changeLogo(formData, companyId);

      setProfile((prev) => ({
        ...prev,
        companyLogo: res.companyLogo,
      }));

      setFile(null);

      toast.success(res.message);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.dismiss();
        toast.error(
          err.response?.data?.message || "Unauthorized. Please login again.",
        );
      } else {
        toast.error((err as Error).message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (updatedData: Partial<Company>) => {
    try {
      setProfile(updatedData);
      if (profile) {
        const data = await editProfile(updatedData, companyId);
        if (data) {
          setReload((prev) => !prev);
          toast.success("Profile Updated Successfully");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const handleReapply = async (customerId: string) => {
    try {
      const response = await reApply(customerId);
      if (response.success) {
        setReload((prev) => !prev);
        toast.success("Reapplied successfully");
      }
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const displayValue = (value: any) =>
    value && value.toString().trim() ? value : "Not Provided";

  return (
    <div className="flex min-h-screen">
      <div className="w-64 h-screen sticky top-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="w-full sticky top-0 z-10 bg-white shadow">
          <Navbar heading="Profile" />
        </div>

        <div className="flex-1 bg-gray-100 p-6 flex justify-center">
          <div className="w-full max-w-3xl space-y-6">
            <div className="bg-white shadow rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative w-32 h-32 bg-[#1F3C58] rounded-full flex items-center justify-center text-4xl text-white shadow-md overflow-visible">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : profile.companyLogo ? (
                    <img
                      src={profile.companyLogo}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUser className="text-5xl" />
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />

                  <button
                    onClick={handleImageClick}
                    type="button"
                    className="absolute bottom-0 right-0 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
                  >
                    <FaCamera className="text-[#1F3C58] text-base" />
                  </button>

                  {preview && file && !isUploading && (
                    <button
                      type="button"
                      className="absolute top-0 right-0 p-1 rounded-full shadow-md transition bg-white"
                      onClick={handleUpload}
                    >
                      <TiTick size={20} color="green" />
                    </button>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-full">
                      <div className="loader border-2 border-white border-t-green-500 rounded-full w-6 h-6 animate-spin"></div>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{profile.companyName}</h1>
                  <p className="text-sm text-gray-600">
                    Owned by : {displayValue(profile.ownerName)}
                  </p>

                  <div className="mt-3 flex flex-col items-start space-y-2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide shadow-sm border ${
                        profile.status === "approve"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : profile.status === "reject"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse"
                      }`}
                    >
                      {profile.status
                        ? profile.status.charAt(0).toUpperCase() +
                          profile.status.slice(1)
                        : "Pending"}
                    </span>

                    {profile.status === "reject" && (
                      <button
                        onClick={() =>
                          profile._id && handleReapply(profile._id)
                        }
                        className="text-xs bg-gradient-to-r from-[#1F3C58] to-[#2E5E88] text-white px-4 py-1.5 rounded-full font-medium shadow hover:opacity-90 transition"
                      >
                        Reapply
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!profile.googleId && (
                <>
                  <button
                    onClick={() => setShowChangePassModal(true)}
                    className="bg-[#011E2B] text-white h-10 rounded-[10px] px-3 py-1 font-semibold hover:bg-[#023430] transition-colors duration-200 text-xs"
                  >
                    Change Password
                  </button>

                  {showChangePassModal && (
                    <ChangePasswordModal
                      onClose={() => setShowChangePassModal(false)}
                      onSubmit={handlePasswordChange}
                    />
                  )}
                </>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">About</h2>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex bg-[#011E2B] items-center px-3 py-1 text-white  rounded-lg text-sm"
                >
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </button>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {displayValue(profile.about)}
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
                    <p className="text-black font-medium">
                      {displayValue(profile.brandName)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Company Name</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.companyName)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Industry Category</p>
                    <p className="text-black font-medium">
                      {displayValue(
                        typeof profile?.industryCategory === "object"
                          ? profile.industryCategory?.categoryName
                          : "",
                      )}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-gray-500">Industry Sub Category</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.industryCategory.)}
                    </p>
                  </div> */}
                  <div>
                    <p className="text-gray-500">Year Founded</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.yearFounded)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Country</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.country)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Year Commenced Franchising</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.yearCommencedFranchising)}
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
                      {displayValue(profile.contactPerson)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Designation</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.designation)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.email)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone Number</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.phoneNumber)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Website</p>
                    <p className="text-black font-medium">
                      {displayValue(profile.website)}
                    </p>
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
                      {profile.numberOfRetailOutlets?.toString().trim()
                        ? profile.numberOfRetailOutlets
                        : "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Number of Franchise Outlets</p>
                    <p className="text-black font-medium">
                      {profile.numberOfFranchiseOutlets?.toString().trim()
                        ? profile.numberOfFranchiseOutlets
                        : "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Manager (Franchise) Name</p>
                    <p className="text-black font-medium">
                      {profile.franchiseManager?.trim()
                        ? profile.franchiseManager
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
                  {profile.companyRegistrationProof ? (
                    <a
                      href={profile.companyRegistrationProof}
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
            {isFormOpen && (
              <ProfileEditForm
                onClose={() => setIsFormOpen(false)}
                initialData={profile}
                onSave={handleSave}
                categories={categories}
              />
            )}

            <div className="text-center text-sm text-gray-600 py-4">
              Unlock Exclusive Benefits – Subscribe Today! <br />
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Get Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
