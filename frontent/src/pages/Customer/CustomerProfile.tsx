import React, { useEffect, useState } from "react";
import Navbar from "../../components/CustomerComponents/Navbar";
import Address from "../../components/CustomerComponents/Address";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { toast } from "react-toastify";
import ChangePasswordModal from "../../components/CommonComponents/ChangePasswordModal";
import { changePassword } from "../../services/profile";
import { getCustomerAPI } from "../../services/customer/profile";
import type { Customer } from "../../types/customer";

interface Order {
  productImage: string;
  brand: string;
  date: string;
  status: string;
  price: number;
}

const orders: Order[] = [
  {
    productImage: "/kfc.jpg",
    brand: "KFC",
    date: "22-02-2025",
    status: "Shipped",
    price: 999.9,
  },
];

const ProfilePage: React.FC = () => {
  const [customer, setCustomer] = useState<Partial<Customer>>({});
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const customerId = user._id;

  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await getCustomerAPI(customerId);
      setCustomer(res.customer);
    };
    fetchCustomer();
  }, [customerId]);

  const handlePasswordChange = async (oldPass: string, newPass: string) => {
    try {
      console.log("Old:", oldPass, "New:", newPass);
      const data = { oldPassword: oldPass, newPassword: newPass };
      const res = await changePassword("customer", customerId, data);
      if (res.success) {
        setShowChangePassModal(false);
        toast.success("Password Changed Successfully");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex">
        <aside className="w-1/4 h-screen p-6 border-r border-gray-200 fixed top-[64px] left-0 bg-gray-50">
          <h2 className="font-bold text-lg mb-2">PROFILE</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="cursor-pointer hover:text-black">ADDRESSES</li>
            <li className="cursor-pointer hover:text-black">ORDER HISTORY</li>
          </ul>
        </aside>

        <main className="flex-1 ml-[25%] p-6">
          <div className="p-6 rounded-lg flex flex-col mb-6">
            <h2 className="font-bold text-lg mb-6">MY PROFILE</h2>
            <div>
              <h1 className="font-bold text-xl">{customer.userName}</h1>
              <hr className="my-2" />
              <p className="text-gray-500">{customer.email}</p>
            </div>
            <button
              onClick={() => setShowChangePassModal(true)}
              className=" text-black px-4 py-2 rounded-2xl border self-end mt-4 hover:bg-black hover:text-white "
            >
              Change Password
            </button>
            {showChangePassModal && (
              <ChangePasswordModal
                onClose={() => setShowChangePassModal(false)}
                onSubmit={handlePasswordChange}
              />
            )}
          </div>

          <hr />

          <Address />

          <hr />

          <section className="mt-10 p-6 rounded-lg mb-6">
            <h2 className="font-bold text-lg mb-6">ORDER HISTORY</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2">Products</th>
                  <th className="pb-2">Brand</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Price</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100 p-4 rounded-md">
                {orders.map((order, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="py-2">
                      {/* <img
                        src={order.productImage}
                        alt={order.brand}
                        className="w-16 h-16 object-cover rounded"
                      /> */}
                    </td>
                    <td>{order.brand}</td>
                    <td>{order.date}</td>
                    <td>{order.status}</td>
                    <td>${order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
