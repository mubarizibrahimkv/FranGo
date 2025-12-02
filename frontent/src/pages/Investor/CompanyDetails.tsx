import type React from "react";
import Navbar from "../../components/InvestorComponents/Navbar";
import type { IFranchise } from "../../types/company";
import FranchiseDetails from "../../components/CompanyComponents/FranchiseDetails";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFranchiseDetails } from "../../services/invstor";
import { IoSendSharp } from "react-icons/io5";
import ChatInputBox from "../../components/CommonComponents/ChatInputBox";
import type { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";

const CompanyDetails: React.FC = () => {
  const [franchise, setFranchise] = useState<IFranchise>({});
  const { id } = useParams<{ id: string }>();
  const [isOpenChat, setIsOpenChat] = useState(false);
  const investor = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchFranhise = async () => {
      if (id) {
        const result = await getFranchiseDetails(id);
        setFranchise(result.franchise);
      }
    };
    fetchFranhise();
  }, [id]);
  const ids = {
    senderId: investor._id,
    recieverId: franchise.company?._id || "",
  };
  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mt-10 mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={franchise.company?.companyLogo}
              alt={franchise.company?.companyName}
              className="w-24 h-24 object-contain border border-gray-200 rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {franchise?.company?.brandName}
              </h2>
              <p className="text-gray-600 text-sm">
                {/* Industry: {franchise?.company?.industryCategory?.categoryName} */}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="bg-[#0C2340] text-white px-6 py-2 rounded-lg hover:bg-[#092032] transition text-sm flex items-center justify-center gap-2"
              onClick={() => setIsOpenChat(true)}
            >
              Message <IoSendSharp />
            </button>
            {isOpenChat && franchise.company?.companyName && (
              <ChatInputBox
                isOpen={isOpenChat}
                ids={ids}
                onClose={() => setIsOpenChat(false)}
                companyName={franchise.company?.companyName}
              />
            )}
            <button className="bg-[#0C2340] text-white px-6 py-2 rounded-lg hover:bg-[#092032] transition text-sm">
              Apply now
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-2 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Founded:</span>{" "}
            {franchise.company?.yearFounded}
          </p>
          <p>
            <span className="font-semibold">Owner Name:</span>{" "}
            {franchise.company?.ownerName}
          </p>
          <p>
            <span className="font-semibold">No. of outlets:</span>{" "}
            {franchise.company?.numberOfRetailOutlets}
          </p>
          <p>
            <span className="font-semibold">Preferred Location:</span>{" "}
            {franchise.preferedLocation}
          </p>
        </div>

        <hr className="my-4 border-gray-300" />

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">About</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {franchise?.company?.about}
          </p>
        </div>
      </div>

      {/* FRANCHISE DETAILS SECTION - MATCHED WIDTH */}
      <div className="max-w-6xl mx-auto p-6 mt-10 bg-gray-100 rounded-t-lg">
        <FranchiseDetails franchise={franchise} />
      </div>
    </div>
  );
};

export default CompanyDetails;
