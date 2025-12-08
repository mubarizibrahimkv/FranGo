import { useEffect, useState } from "react";
import Navbar from "../../components/InvestorComponents/Navbar";
import { getMyFranchises } from "../../services/invstor";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { FaChartLine, FaDollarSign, FaTags } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { IFranchise } from "../../types/company";
import { useNavigate } from "react-router-dom";

interface IMyFranchises{
  _id:string
  franchise:IFranchise
}

const MyFranchises = () => {
  const [franchises, setFranchises] = useState<IMyFranchises[]|[]>([]);
  const investorId = useSelector((state: RootState) => state.user._id);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchMyFranchises = async () => {
      const franchises = await getMyFranchises(investorId);
      console.log(franchises.franchises,"my fanchisess")
      setFranchises(franchises.franchises);
    };
    fetchMyFranchises();
  }, []);


   const handleNaviagation = (id: string) => {
    navigate(`/franchise/${id}`);
  };

  return (
    <div>
      <Navbar />
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="text-red-500 text-2xl">•</span> Recommended
          Franchises
        </h2>
        <p className="text-gray-600 mb-6">Explore franchises</p>

        {franchises.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-lg font-medium">
            No results found. Try adjusting your filters or search.
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {franchises.map((franchise) => (
              <div
                key={franchise._id}
                className="w-[270px] rounded-[10px] border-2 bg-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center p-5 gap-2 cursor-pointer"
              >
                <img
                  src={franchise?.franchise?.company?.companyLogo}
                  alt={franchise.franchise.franchiseName}
                  className="w-28 h-28 object-contain rounded-full mb-3 shadow-md"
                />

                <hr className="w-full border-t my-2" />

                <p className="text-base font-bold text-[#023430]">
                  {franchise.franchise.franchiseName}
                </p>

                <div className="text-xs text-[#023430] space-y-2 text-center">
                  <p className="flex items-center justify-center gap-2">
                    <FaDollarSign />
                    Investment Range:{" "}
                    <span className="font-semibold text-[#011E2B]">
                      ₹{franchise.franchise.totalInvestement}
                    </span>
                  </p>

                  <p className="flex items-center justify-center gap-2">
                    <FaChartLine />
                    Monthly Revenue:{" "}
                    <span className="font-semibold text-[#011E2B]">
                      ₹{franchise.franchise.monthlyRevenue}
                    </span>
                  </p>

                  <p className="flex items-center justify-center gap-2">
                    <FaMapMarkerAlt />
                    Prefered Location:{" "}
                    <span className="font-semibold text-[#011E2B]">
                      {franchise.franchise.preferedLocation?.join(",")}
                    </span>
                  </p>

                  <p className="flex items-center justify-center gap-2">
                    <FaTags />
                    Category:{" "}
                    <span className="font-semibold text-[#011E2B]">
                      {franchise.franchise.company?.industryCategory?.categoryName}
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() =>
                      franchise._id && handleNaviagation(franchise._id)
                    }
                    className="border border-black text-[#023430] w-28 h-10 rounded-[10px] px-3 py-1 font-semibold hover:bg-[#DBFDFA] transition-colors duration-200 text-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFranchises;
