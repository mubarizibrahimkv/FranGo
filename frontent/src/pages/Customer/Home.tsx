import { useEffect, useState } from "react";
import Navbar from "../../components/CustomerComponents/Navbar";
import { getCategories } from "../../services/admin/manageUsers";
import type { IIndustryCategory } from "../../types/admin";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";
import Footer from "../../components/InvestorComponents/Footer";
import { useNavigate } from "react-router-dom";

const CustomerHomePage = () => {
  const navigate = useNavigate();
  const [industryCategory, setInustryCategory] = useState<
    IIndustryCategory[] | []
  >([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getCategory = async () => {
      const res = await getCategories(searchText);
      if (res.success) {
        setInustryCategory(res.industries);
        setTotalPages(res.totalPages);
      }
    };
    getCategory();
  }, [searchText, totalPages, page]);

  const navigateToFranchiseListPage = (industryCategoryId: string) => {
    navigate(`/customer/franchise?industryCategoryId=${industryCategoryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow mb-80">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Industry Categories
            </h2>

            <div className="w-full max-w-md">
              <AdminSearchBar
                onSubmit={(text: string) => setSearchText(text)}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {industryCategory.map((category) => (
              <div
                onClick={() =>
                  category._id && navigateToFranchiseListPage(category._id)
                }
                key={category._id}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="h-44 w-full overflow-hidden">
                  <img
                    src={
                      category.image instanceof File
                        ? URL.createObjectURL(category.image)
                        : category.image
                    }
                    alt={category.categoryName}
                    className="h-full w-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />

                <div className="p-4 text-center">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
                    {category.categoryName}
                  </h3>
                </div>
              </div>
            ))}
          </div>
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

export default CustomerHomePage;
