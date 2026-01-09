import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import type { IIndustryCategory } from "../../types/admin";
import CategoryFormModal from "../../components/AdminComponents/CategoryFormModal";
import {
  addCategories,
  deleteCategory,
  editCategories,
  getCategories,
} from "../../services/admin/manageUsers";
import { toast } from "react-toastify";
import { Edit } from "lucide-react";
import { FaTrashAlt } from "react-icons/fa";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";

const AdminCategory = () => {
  const [categories, setCategories] = useState<IIndustryCategory[]>([]);
  const [industryCategory, setInustryCategory] = useState<IIndustryCategory[]>(
    [],
  );
  const [isOpenModal, setIsModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<IIndustryCategory | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const getCategory = async () => {
      const res = await getCategories(searchText, page, filter);

      if (res.success) {
        setCategories(res.industries);
        setTotalPages(res.totalPages);
      }
    };

    getCategory();
  }, [reload, searchText, page, filter]);

  useEffect(() => {
    const getCategory = async () => {
      const res = await getCategories();
      if (res.success) {
        setInustryCategory(res.industries);
      }
    };

    getCategory();
  }, []);

  const handleCategory = async (formData: FormData) => {
    try {
      console.log("FINAL FORMDATA SENT:");
      formData.forEach((value, key) => console.log(key, value));

      let result;

      if (selectedCategory?._id) {
        result = await editCategories(formData);
      } else {
        result = await addCategories(formData);
      }

      if (result.success) {
        toast.success("Category saved successfully");
        setReload((prev) => !prev);
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id);
    if (result.success) {
      setReload((prev) => !prev);
      toast.success("Category Deleted Successfully");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar heading="Categories" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 mt-10">
            <div className="flex-1">
              <AdminSearchBar
                onSubmit={(text: string) => setSearchText(text)}
              />
            </div>

            <button
              onClick={() => {
                setSelectedCategory(null);
                setIsModal(true);
              }}
              className="bg-[#0C2340] text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors ml-4"
            >
              ADD CATEGORY
            </button>

            {isOpenModal && (
              <CategoryFormModal
                onClose={() => setIsModal(false)}
                onsubmit={handleCategory}
                initialData={selectedCategory || undefined}
              />
            )}
          </div>

          <div className="w-full flex justify-center">
            <div className="max-w-5xl w-full px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* ================= Product Category ================= */}
                <div className="md:col-span-4 text-center">
                  <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Industry Category
                  </label>

                  <div className="flex justify-center gap-2 flex-wrap">
                    {/* All */}
                    <button
                      onClick={() => setFilter("")}
                      className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
              ${
                filter === ""
                  ? "bg-[#0C2340] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
                    >
                      All
                    </button>

                    {industryCategory?.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => setFilter(item._id ? item._id : "")}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
                ${
                  filter === item._id
                    ? "bg-[#0C2340] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                      >
                        {item.categoryName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#0C2340] text-white text-base">
                {/* <th className="px-5 py-3 text-left font-semibold rounded-tl-lg">
                  Image
                </th> */}
                <th className="px-5 py-3 text-left font-semibold rounded-tl-lg">
                  Category
                </th>
                <th className="px-5 py-3 text-left font-semibold">
                  Sub Category
                </th>
                <th className="px-5 py-3 text-left font-semibold">
                  Sub-Sub Category
                </th>
                <th className="px-5 py-3 text-left font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr
                    key={index}
                    className="bg-white text-[13px] font-semibold hover:shadow-md transition-all"
                  >
                    <td className="px-5 py-2">
                      {category.categoryName || "N/A"}
                    </td>

                    <td className="px-5 py-2">
                      {category.subCategories &&
                      category.subCategories.length > 0
                        ? category.subCategories.map((sub, i) => (
                            <div key={i} className="mb-1">
                              {sub.name}
                              {i !== category.subCategories.length - 1 && (
                                <hr className="border-t border-gray-300 my-1" />
                              )}
                            </div>
                          ))
                        : "N/A"}
                    </td>

                    <td className="px-5 py-2">
                      {category.subCategories &&
                      category.subCategories.length > 0
                        ? category.subCategories.map((sub, i) => (
                            <div key={i} className="mb-1">
                              {sub.subSubCategories &&
                              sub.subSubCategories.length > 0 ? (
                                sub.subSubCategories.map((subsub, j) => (
                                  <span key={j} className="inline-block mr-2">
                                    {subsub.name}
                                    {j !== sub.subSubCategories.length - 1
                                      ? ","
                                      : ""}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400">
                                  No sub-subcategories
                                </span>
                              )}
                              {i !== category.subCategories.length - 1 && (
                                <hr className="border-t border-gray-200 my-1" />
                              )}
                            </div>
                          ))
                        : "N/A"}
                    </td>

                    <td className="px-5 py-2 text-center">
                      <div className="inline-flex items-center justify-center space-x-2">
                        <button
                          className="text-red-400 hover:underline"
                          onClick={() =>
                            category._id && handleDelete(category._id)
                          }
                        >
                          <FaTrashAlt size={18} />
                        </button>

                        <Edit
                          onClick={() => {
                            setIsModal(true);
                            setSelectedCategory(category);
                          }}
                          size={18}
                          className="text-green-400 hover:underline"
                        />
                      </div>
                    </td>
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

export default AdminCategory;
