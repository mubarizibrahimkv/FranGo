import { useEffect, useState } from "react";
import Footer from "../../components/InvestorComponents/Footer";
import Navbar from "../../components/InvestorComponents/Navbar";
import AdminSearchBar from "../../components/CommonComponents/SearchBar";
import { getProductsByfranchise, updateQuantity } from "../../services/invstor";
import type { IProduct } from "../../types/company";
import { useParams } from "react-router-dom";

const Products = () => {
  const [page, setPage] = useState(1);
  const { applicationId, companyId } = useParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!companyId || !applicationId) return;
      const res = await getProductsByfranchise(
        companyId,
        applicationId,
        page,
        searchText,
      );
      if (res.success) {
        setProducts(res.products);
        console.log(res.products);
        setPage(page);
        setTotalPages(res.totalPages);
      }
    };
    fetchApplications();
  }, [page, searchText]);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (!companyId || !applicationId) return;
    await updateQuantity(applicationId, productId, quantity);
  };

  const handleInputChange = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, quantity } : p)),
    );
  };

  return (
    <div className="bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6 mt-4  rounded-t-lg min-h-[80vh]">
        <div className="overflow-x-auto px-4 py-2">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-left font-serif">
            My Products
          </h1>
          <div className="flex justify-end mb-4 gap-4">
            <div className="flex-1">
              <div className="w-3/4 ml-2">
                <AdminSearchBar
                  onSubmit={(text: string) => setSearchText(text)}
                />
              </div>
            </div>

            {/* <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm ">
              {[
                { label: "All", value: "" },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setFilterValue(value)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all
                  ${
                    filterValue === value
                      ? "bg-[#0C2340] text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div> */}
          </div>
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#0C2340] text-white text-sm text-center">
                <th className="px-4 py-3 rounded-tl-lg">Image</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Quantity</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="bg-white text-sm font-semibold hover:shadow-md transition-all"
                >
                  <td className="px-4 py-3 flex justify-center">
                    <img
                      src={
                        typeof product.images?.[0] === "string"
                          ? product.images[0]
                          : ""
                      }
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="px-4 py-3">{product.name}</td>

                  <td className="px-4 py-3">₹{product.price}</td>

                  <td className="px-4 py-3">{product.status}</td>

                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={product.quantity === 0 ? "" : product.quantity}
                      onChange={(e) => {
                        if (!product._id) return;

                        const qty =
                          e.target.value === "" ? 0 : Number(e.target.value);

                        handleInputChange(product._id, qty);
                      }}
                      onBlur={(e) => {
                        if (!product._id) return;
                        handleQuantityChange(
                          product._id,
                          Number(e.target.value) || 0,
                        );
                      }}
                      className="w-20 border rounded px-2 py-1 text-center"
                    />
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* {showAlert && (
          <ConfirmAlert
            type="warning"
            title="Are you sure?"
            message="Deleting this application cannot be undone. Do you want to continue?"
            onClose={() => setShowAlert(false)}
            onConfirm={() => {
              handleDelete(selectedApp);
              setShowAlert(false);
            }}
          />
        )} */}

        {/* {selectedFranchise && investor && (
          <ApplyModal
            onClose={() => setSelectedFranchise(null)}
            onApply={handleApply}
            franchiseData={selectedFranchise}
            investorData={investor}
          />
        )} */}

        <div className="flex justify-center mt-8 items-center gap-2 mb-4">
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

export default Products;
