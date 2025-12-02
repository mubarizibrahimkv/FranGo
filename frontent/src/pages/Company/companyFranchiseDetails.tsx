import { useEffect, useState } from "react";
import Navbar from "../../components/CompanyComponents/Navbar";
import FranchiseDetails from "../../components/CompanyComponents/FranchiseDetails";
import type { IFranchise } from "../../types/company";
import { getSpecificFranchise } from "../../services/company/companyProfile";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/CompanyComponents/Sidebar";

const CompanyFranchiseDetails = () => {
  const [franchise, setFranchise] = useState<IFranchise>({});
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const fetchFranhise = async () => {
      if (id) {
        const result = await getSpecificFranchise(id);
        setFranchise(result.franchise);
      }
    };
    fetchFranhise();
  }, [id]);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 left-64 right-0 z-10 bg-white shadow-md">
          <Navbar heading={"Franchise Details"} />
        </div>

        <main className="flex-1 p-6 mt-20 bg-gray-100 rounded-t-lg overflow-y-auto">
          <FranchiseDetails franchise={franchise} />
        </main>
      </div>
    </div>
  );
};

export default CompanyFranchiseDetails;
