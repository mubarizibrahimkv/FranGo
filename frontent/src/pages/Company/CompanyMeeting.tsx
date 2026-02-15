import { useState } from "react";
import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";

const CompanyMeeting = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading={"Franchises"} />

        <main className="flex-1 p-6 mt-4 bg-gray-100 rounded-t-lg">
          <div className="flex mb-4 justify-between">
            {/* <div className="w-3/4 ml-2">
              <AdminSearchBar
                onSubmit={(text: string) => setSearchText(text)}
              />
            </div> */}
            <button
              //   onClick={() => {
              //     setSelectedFranchise(null);
              //     setIsOpenModal(true);
              //   }}
              className="bg-[#0C2340] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors"
            >
              ADD
            </button>
          </div>
          {/* {isOpenModal && (
            <FranchiseModal
              isEdit={false}
              onClose={() => setIsOpenModal(false)}
              onSubmit={handleSubmit}
              category={category}
              initialData={selectedFranchise || undefined}
            />
          )} */}

          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#0C2340] text-white text-base text-center">
                <th className="px-5 py-3 font-semibold rounded-tl-lg">Name</th>
                <th className="px-5 py-3 font-semibold">Total Fee</th>
                <th className="px-5 py-3 font-semibold">Ownership Model</th>
                <th className="px-5 py-3 font-semibold">Avg Monthly Revenue</th>
                <th className="px-5 py-3 font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>

            {/* <tbody className="text-center">
              {franchises.map((franchise, index) => (
                <tr
                  key={index}
                  onClick={() =>
                    franchise._id && handleViewDetail(franchise._id)
                  }
                  className="bg-white text-[13px] font-semibold hover:shadow-md transition-all"
                >
                  <td className="px-5 py-2">
                    {franchise.franchiseName || "N/A"}
                  </td>
                  <td className="px-5 py-2">
                    {franchise.franchisefee || "N/A"}
                  </td>
                  <td className="px-5 py-2">
                    {franchise.ownershipModel || "N/A"}
                  </td>
                  <td className="px-5 py-2">
                    {franchise.monthlyRevenue || "N/A"}
                  </td>
                  <td className="px-5 py-2 flex items-center justify-center gap-5">
                    <button className="text-red-400 hover:underline cursor-pointer">
                      <FaTrashAlt
                        size={18}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(franchise._id!);
                        }}
                      />
                    </button>
                    <Edit
                      size={18}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFranchise(franchise);
                        setIsOpenModal(true);
                      }}
                      className="text-green-400 hover:underline cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
              {confirmationModal && franchiseToDelete && (
                <ConfirmAlert
                  type="warning"
                  title="Delete Confirmation"
                  message="Do you really want to delete this franchise record?"
                  onClose={() => {
                    setConfirmationModal(false);
                    setFranchiseToDelete(null);
                  }}
                  onConfirm={async () => {
                    await handleDelete(franchiseToDelete);
                    setConfirmationModal(false);
                    setFranchiseToDelete(null);
                  }}
                />
              )}

              {franchises.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No franchises available.
                  </td>
                </tr>
              )}
            </tbody> */}
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

export default CompanyMeeting;
