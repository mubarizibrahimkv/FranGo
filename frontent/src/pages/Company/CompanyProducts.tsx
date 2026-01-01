import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";
import { useEffect, useState } from "react";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProductCategories,
  getProducts,
} from "../../services/company/companyProfile";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import type { ProductCategory } from "./CompanyProductCategory";
import ProductModal from "../../components/CompanyComponents/Modals/ProductModal";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import { Edit } from "lucide-react";
import type { IProduct } from "../../types/company";
import ConfirmAlert from "../../components/CommonComponents/ConfirmationModal";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";

export interface IProductForm extends IProduct {
  removedImages?: string[];
}

const CompanyProducts = () => {
  const company = useSelector((state: RootState) => state.user);
  const [reload, setReload] = useState(false);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<IProduct[] | []>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [productCategory, setProductCategory] = useState("");

  useEffect(() => {
    const fetchCompanyProductCategories = async () => {
      const res = await getProductCategories(company._id);
      setProductCategories(res.data);
    };
    fetchCompanyProductCategories();
  }, [page, company._id]);

  useEffect(() => {
    const filter=productCategory
    const fetchProducts = async () => {
      const response = await getProducts(company._id, page, searchText,filter);
      setProducts(response.products);
      setPage(response.currentPage);
      setTotalPages(response.totalPages);
    };
    fetchProducts();
  }, [page, reload, company._id, searchText,productCategory]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: IProduct) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    const res = await deleteProduct(productId);
    if (res.success) {
      toast.success("Product Deleted");
      setReload((prev) => !prev);
    }
  };

  const handleModalSubmit = async (
    formData: IProductForm,
    editing: boolean
  ) => {
    try {
      setIsSubmitting(true);
      if (editing) {
        try {
          const productId = formData._id;
          if (productId) {
            const data = new FormData();

            data.append("category", formData.category || "");
            data.append("name", formData.name || "");
            data.append("price", String(formData.price ?? ""));
            data.append("description", formData.description || "");

            formData.images.forEach((file) => {
              data.append("images", file);
            });

            data.append(
              "removedImages",
              JSON.stringify(formData.removedImages || [])
            );

            const res = await editProduct(company._id, productId, data);
            if (res?.success) {
              toast.success(" Product Updated Successfully!");
              setReload((prev) => !prev);
              setIsModalOpen(false);
            } else {
              toast.error(" Failed to Updated product");
            }
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);

          toast.error(message);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(true);
        const data = new FormData();
        data.append("category", formData.category || "");
        data.append("name", formData.name || "");
        data.append("price", String(formData.price ?? ""));
        data.append("description", formData.description || "");

        formData.images.forEach((file) => {
          data.append("images", file);
        });

        const res = await addProduct(company._id, data);

        if (res?.success) {
          toast.success(" Product Added Successfully!");
          setReload((prev) => !prev);
          setIsModalOpen(false);
        } else {
          toast.error(" Failed to add product");
        }
      }
      setReload((prev) => !prev);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading="Products" />

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
              onClick={handleAddProduct}
              className="bg-[#0C2340] text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors ml-4"
            >
              ADD
            </button>

            <ProductModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleModalSubmit}
              productCategories={productCategories}
              initialData={selectedProduct}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
            />
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
                      onClick={() => setProductCategory("")}
                      className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
              ${
                productCategory === ""
                  ? "bg-[#0C2340] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
                    >
                      All
                    </button>

                    {productCategories.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => setProductCategory(item._id)}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition
                ${
                  productCategory === item._id
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
                <th className="px-5 py-3 font-semibold rounded-tl-lg">Image</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Product Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products?.length > 0 ? (
                products?.map((product, index) => (
                  <tr
                    key={index}
                    className="bg-white text-[13px] font-semibold hover:shadow-md transition-all text-center"
                  >
                    <td className="px-5 py-2">
                      <img
                        src={
                          product.images[0] instanceof File
                            ? URL.createObjectURL(product.images[0])
                            : product.images[0]
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover mx-auto rounded"
                      />
                    </td>
                    <td className="px-5 py-2">{product.name}</td>
                    <td className="px-5 py-2">
                      {product.productCategory?.name}
                    </td>
                    <td className="px-5 py-2">{product.price}</td>
                    <td className="px-5 py-2">{product.description}</td>
                    <td className="px-5 py-2 flex items-center justify-center gap-3">
                      <button
                        className="text-red-400 hover:underline"
                        onClick={() => {
                          setSelectedProductId(product._id!);
                          setConfirmationModal(true);
                        }}
                      >
                        <FaTrashAlt size={18} />
                      </button>
                      <Edit
                        size={18}
                        onClick={() => handleEditProduct(product)}
                        className="text-green-400 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No products available.
                  </td>
                </tr>
              )}

              {confirmationModal && (
                <ConfirmAlert
                  type="warning"
                  title="Delete Confirmation"
                  message="Do you really want to delete this product?"
                  onClose={() => {
                    setConfirmationModal(false);
                  }}
                  onConfirm={async () => {
                    selectedProductId && handleDelete(selectedProductId);
                    setConfirmationModal(false);
                  }}
                />
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

export default CompanyProducts;
