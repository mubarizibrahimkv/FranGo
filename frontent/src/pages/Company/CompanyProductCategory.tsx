import { useEffect, useState } from "react";
import ProductCategoryModal from "../../components/AdminComponents/Modal/ProductCategoryModal";
import { toast } from "react-toastify";
import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  addProductCategories,
  deleteProductCategories,
  editProductCategories,
  fetchCompany,
  getProductCategories,
} from "../../services/company/companyProfile";
import type { IIndustryCategory } from "../../types/admin";
import { Edit } from "lucide-react";
import { FaTrashAlt } from "react-icons/fa";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";

export interface ProductCategory {
  _id: string;
  name: string;
  status: string;
  isListed: boolean;
  categoryDetails: {
    industryName: string;
    subCategoryName: string;
    subSubCategoryName: string;
  };
}
const AdminProductCategory = () => {
  const [industryCategories, setIndustryCategories] =
    useState<IIndustryCategory>();
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    [],
  );
  const [isOpenModal, setIsModal] = useState(false);
  const company = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [editedName, setEditedName] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    const getCategory = async () => {
      const res = await fetchCompany(company._id);
      if (res.success) {
        setIndustryCategories(res.data.industryCategory);
      }
    };
    getCategory();
  }, [company._id]);

  useEffect(() => {
    const filter = subCategory;
    const getProductCategory = async () => {
      const res = await getProductCategories(company._id, searchText, filter);
      if (res.success) {
        setTotalPages(res.totalPages);
        setProductCategories(res.data);
      }
    };
    getProductCategory();
  }, [company._id, searchText, page, subCategory, editedName]);

  const handleProductCategory = async (data: {
    industryCategoryId: string;
    subCategoryId: string;
    subSubCategoryId: string;
    productCategoryName: string;
  }) => {
    try {
      const res = await addProductCategories(company._id, data);
      if (res.success) {
        setIsModalOpen(false);
        toast.success("Categories Added");
      } else {
        setError(res.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleEditClick = (category: ProductCategory) => {
    setSelectedCategory(category);
    setEditedName(category.name);
    setIsModalOpen(true);
  };
  const handleUpdate = async () => {
    if (!selectedCategory) return;
    try {
      const res = await editProductCategories(
        company._id,
        selectedCategory._id,
        editedName,
      );
      if (res.success) {
        toast.success("Edited");
        setIsModalOpen(false);
      } else {
        setError(res.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      toast.error(message);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteProductCategories(company._id, categoryId);
      toast.success("Deleted");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading="Product Categories" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <div className="w-3/4 ml-2">
                <AdminSearchBar
                  onSubmit={(text: string) => setSearchText(text)}
                />
              </div>
            </div>

            <button
              onClick={() => {
                setIsModal(true);
              }}
              className="bg-[#0C2340] text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors ml-4"
            >
              ADD
            </button>

            {isOpenModal && (
              <ProductCategoryModal
                onClose={() => setIsModal(false)}
                onSubmit={(data) => handleProductCategory(data)}
                industryCategories={industryCategories}
                error={error}
              />
            )}
          </div>

          <div className="w-full flex justify-center">
            <div className="max-w-5xl w-full px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* ================= Product Category ================= */}
                <div className="md:col-span-4 text-center">
                  <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Product Category
                  </label>

                  <div className="flex justify-center gap-2 flex-wrap">
                    {/* All */}
                    <button
                      onClick={() => setSubCategory("")}
                      className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
              ${
                subCategory === ""
                  ? "bg-[#0C2340] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
                    >
                      All
                    </button>

                    {industryCategories?.subCategories.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => setSubCategory(item._id ? item._id : "")}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
                ${
                  subCategory === item._id
                    ? "bg-[#0C2340] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <table className="min-w-full border-separate border-spacing-y-2 text-center">
            <thead>
              <tr className="bg-[#0C2340] text-white text-base">
                <th className="px-5 py-3 font-semibold rounded-tl-lg">
                  Sub Category
                </th>
                <th className="px-5 py-3 font-semibold">Sub-Sub Category</th>
                <th className="px-5 py-3 font-semibold">Product Category</th>
                <th className="px-5 py-3 font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {productCategories.length > 0 ? (
                productCategories.map((category, index) => (
                  <tr
                    key={index}
                    className="bg-white text-[13px] font-semibold hover:shadow-md transition-all text-center"
                  >
                    <td className="px-5 py-2">
                      {category.categoryDetails.subCategoryName || "N/A"}
                    </td>
                    <td className="px-5 py-2">
                      {category.categoryDetails.subSubCategoryName || "N/A"}
                    </td>
                    <td className="px-5 py-2">{category.name || "N/A"}</td>
                    <td className="px-5 py-2 flex items-center justify-center gap-3">
                      <button
                        className="text-red-400 hover:underline"
                        onClick={() => handleDelete(category._id)}
                      >
                        <FaTrashAlt size={18} />
                      </button>
                      <Edit
                        size={18}
                        onClick={() => handleEditClick(category)}
                        className="text-green-400 cursor-pointer"
                      />
                    </td>

                    {isModalOpen && (
                      <div className="fixed inset-0  backdrop-blur-xs flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-[400px] shadow-lg">
                          <h2 className="text-lg font-semibold mb-4 text-center">
                            Edit Product Category
                          </h2>

                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 outline-none"
                            placeholder="Enter new category name"
                          />

                          {error && (
                            <p className="text-xs text-red-500 mt-1">{error}</p>
                          )}

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleUpdate}
                              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
      </div>
    </div>
  );
};

export default AdminProductCategory;
