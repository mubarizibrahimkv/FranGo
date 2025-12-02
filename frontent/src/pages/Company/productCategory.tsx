// import { useEffect, useState } from "react";
// import Navbar from "../../components/CompanyComponents/Navbar";
// import Sidebar from "../../components/CompanyComponents/Sidebar";
// import { Edit } from "lucide-react";
// import { FaTrashAlt } from "react-icons/fa";

// const productCategory = () => {
//     const [categories,setCategories]=useState([])
//     const [isOpenModal,setIsOpenModal]=useState(false)
//     const [industrySubCategories,setIndustrySubCategories]=useState()
//     const [selectedProductCategory,setSelectedProductCategory]=useState()
//     const handleSubmit=async()=>{

//     }

//     useEffect(()=>{
//         const fetchProductCateogories=async()=>{
            
//         }
//     })
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 flex flex-col">
//         <Navbar heading={"Franchises"} />

//         <main className="flex-1 p-6 mt-4 bg-gray-100 rounded-t-lg">
//           <div className="overflow-x-auto px-4 py-2">
//             <div className="flex justify-end mb-4">
//               <button
//                 // onClick={() => {
//                 //   setSelectedFranchise(null);
//                 //   setIsOpenModal(true);
//                 // }}
//                 className="bg-[#0C2340] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E3A8A] transition-colors"
//               >
//                 ADD
//               </button>
//             </div>
//             {isOpenModal && (
//               <FranchiseModal
//                 onClose={() => setIsOpenModal(false)}
//                 onSubmit={handleSubmit}
//                 initialData={selectedCategory || undefined}
//               />
//             )}
//             <table className="min-w-full border-separate border-spacing-y-2">
//               <thead>
//                 <tr className="bg-[#0C2340] text-white text-base text-center">
//                   <th className="px-5 py-3 font-semibold rounded-tl-lg">
//                     Category Name
//                   </th>
//                   <th className="px-5 py-3 font-semibold">
//                     Created Date
//                   </th>
//                   <th className="px-5 py-3 font-semibold rounded-tr-lg">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="text-center">
//                 {/* {categories.map((category, index) => (
//                   <tr
//                     key={index}
//                     className="bg-white text-[13px] font-semibold hover:shadow-md transition-all"
//                   >
//                     <td className="px-5 py-2">
//                       {franchise.franchiseName || "N/A"}
//                     </td>
//                     <td className="px-5 py-2">
//                       {franchise.franchisefee || "N/A"}
//                     </td>
//                     <td className="px-5 py-2">
//                       {franchise.ownershipModel || "N/A"}
//                     </td>
//                     <td className="px-5 py-2">
//                       {franchise.monthlyRevenue || "N/A"}
//                     </td>
//                     <td className="px-5 py-2 flex items-center justify-center gap-5">
//                       <button className="text-red-400 hover:underline cursor-pointer">
//                         <FaTrashAlt
//                           size={18}
//                         //  onClick={() => {
//                         //   handleDeleteClick(franchise._id!);
//                         // }}
//                         />
//                       </button>
//                       <Edit
//                         size={18}
//                         // onClick={() => {
//                         //   setSelectedFranchise(franchise);
//                         //   setIsOpenModal(true);
//                         // }}
//                         className="text-green-400 hover:underline cursor-pointer"
//                       />
//                     </td>
//                   </tr>
//                 ))} */}
//                 {/* {confirmationModal && franchiseToDelete && (
//                   <ConfirmAlert
//                     type="warning"
//                     title="Delete Confirmation"
//                     message="Do you really want to delete this franchise record?"
//                     onClose={() => {
//                       setConfirmationModal(false);
//                       setFranchiseToDelete(null);
//                     }}
//                     onConfirm={async () => {
//                       await handleDelete(franchiseToDelete);
//                       setConfirmationModal(false);
//                       setFranchiseToDelete(null);
//                     }}
//                   />
//                 )} */}

//                 {categories.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4 text-gray-500">
//                       No franchises available.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default productCategory
