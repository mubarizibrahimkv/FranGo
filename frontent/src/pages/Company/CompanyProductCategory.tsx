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
    []
  );
  const [isOpenModal, setIsModal] = useState(false);
  const company = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [editedName, setEditedName] = useState("");
  const [error,setError]=useState("")

  useEffect(() => {
    const getCategory = async () => {
      const res = await fetchCompany(company._id);
      if (res.success) {
        setIndustryCategories(res.data.industryCategory);
      }
    };
    getCategory();
  }, []);

  useEffect(() => {
    const getProductCategory = async () => {
      const res = await getProductCategories(company._id);
      if (res.success) {
        setProductCategories(res.data);
      }
    };
    getProductCategory();
  }, []);

  const handleProductCategory = async (data: {
    industryCategoryId: string;
    subCategoryId: string;
    subSubCategoryId: string;
    productCategoryName: string;
  }) => {
    try {
      const res = await addProductCategories(company._id, data);
      if (res.success) {
        setIsModalOpen(false)
        toast.success("Categories Added");
      }else{
        setError(res.message)
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
      const res=await editProductCategories(
        company._id,
        selectedCategory._id,
        editedName
      );
      if(res.success){
           toast.success("Edited");
      setIsModalOpen(false);
      }else{
        setError(res.message)
      }
    } catch (error: unknown) {
    const err = error as any;
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong";
      setError(msg)
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
            <div className="flex-1">{/* <SearchBar /> */}</div>

            <button
              onClick={() => {
                setIsModal(true);
              }}
              className="bg-[#0C2340] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors ml-4"
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

                          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}


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
        </main>
      </div>
    </div>
  );
};

export default AdminProductCategory;
