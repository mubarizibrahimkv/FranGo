import { useEffect, useState } from "react";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";
import Navbar from "../../components/CustomerComponents/Navbar";
import Footer from "../../components/InvestorComponents/Footer";
import { useSearchParams } from "react-router-dom";
import { getFranchisesByCategory } from "../../services/customer/commmerce";
import { FaChartLine, FaDollarSign, FaTags } from "react-icons/fa6";
import type { IFranchise } from "../../types/company";

const FranchiseList = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const industryCategoryId = searchParams.get("industryCategoryId");
  const [franchises, setFranchises] = useState<IFranchise[] | []>([]);

  useEffect(() => {
    if (!industryCategoryId) return;
    fetchFranchises(industryCategoryId);
  }, [page, searchText]);

  const fetchFranchises = async (categoryId: string) => {
    const result = await getFranchisesByCategory(categoryId, page, searchText);
    setFranchises(result.franchises);
    console.log(result)
    setPage(page);
    setTotalPages(result.totalPages);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow mb-80">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Franchises</h2>

            <div className="w-full max-w-md">
              <AdminSearchBar
                onSubmit={(text: string) => setSearchText(text)}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-10">
          {franchises.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-lg font-medium">
              No results found. Try adjusting your filters or search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {franchises.map((franchise) => (
                <div
                  key={franchise._id}
                  className="max-w-[300px] w-full mx-auto rounded-[12px] border bg-white shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center p-4 gap-3 cursor-pointer"
                >
                  <img
                    src={franchise.company?.companyLogo}
                    alt={franchise.company?.brandName}
                    className="w-24 h-24 object-contain rounded-full shadow-md"
                  />

                  <p className="text-base font-bold text-[#023430] text-center">
                    {franchise.franchiseName}
                  </p>

                  <p className="text-xs text-gray-500 text-center">
                    {franchise.company?.companyName}
                  </p>

                  <hr className="w-full border-t my-2" />

                  <div className="text-sm text-[#023430] space-y-2 text-center w-full">
                    <p className="flex items-center justify-center gap-2">
                      <FaDollarSign />
                      Investment:
                      <span className="font-semibold text-[#011E2B]">
                        ₹{franchise.totalInvestement}
                      </span>
                    </p>

                    <p className="flex items-center justify-center gap-2">
                      <FaChartLine />
                      Monthly Revenue:
                      <span className="font-semibold text-[#011E2B]">
                        ₹{franchise.monthlyRevenue}
                      </span>
                    </p>

                    <p className="flex items-center justify-center gap-2">
                      <FaTags />
                      Sub Category:
                      <span className="font-semibold text-[#011E2B]">
                        {franchise.industrySubCategory?.name}
                      </span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {franchise.industrySubSubCategory?.map(
                        (name, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-full bg-[#E6F4F1] text-[#023430] font-medium"
                          >
                            {name}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-2 mb-4">
          {page > 1 && (
            <div
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              {"<"}
            </div>
          )}

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-[#0C2340] text-white" : "bg-gray-200 "
              }`}
            >
              {i + 1}
            </button>
          ))}

          {page < totalPages && (
            <div
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              {">"}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FranchiseList;
