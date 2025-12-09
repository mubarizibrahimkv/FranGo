import { useEffect, useState } from "react";
import AddressFormModal from "../../components/CustomerComponents/customerModals/AddressFormModal";
import {
  addAddress,
  deleteAddress,
  editAddress,
  getAddress,
} from "../../services/customer/profile";
import { toast } from "react-toastify";
import type { IAddress } from "../../types/customer";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import ConfirmAlert from "../CommonComponents/ConfirmationModal";

const Address = () => {
  const [address, setAddress] = useState<IAddress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const customerId = useSelector((state: RootState) => state.user._id);
  const [reload, setReload] = useState(false);
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] =
    useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const getAddreses = async () => {
      try {
        const addresses = await getAddress(customerId);
        if (addresses.success) {
          console.log(addresses.customer);
          setAddress(addresses.customer);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message);
      }
    };
    getAddreses();
  }, [customerId, reload]);

  const handleAdd = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (newAddress: IAddress) => {
    console.log(newAddress, "new address in forntetetetete");
    try {
      let result;
      if (selectedAddress && selectedAddress._id) {
        result = await editAddress(newAddress, selectedAddress._id);
        if (result.success) {
          toast.success("Address Edited Successfully");
        }
      } else {
        result = await addAddress(newAddress, customerId);
        if (result.success) {
          toast.success("Address Created Successfully");
        }
      }
      setIsModalOpen(false);
      setReload((prev) => !prev);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  const handleEdit = async (address: IAddress) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    try {
      const result = await deleteAddress(addressId);
      if (result.success) {
        setReload((prev) => !prev);
        toast.success("Address Deleted Successfully");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    }
  };

  return (
    <div>
      <section className="max-w-4xl mx-auto mt-10 mb-10 space-y-4">
        <h2 className="font-bold text-lg mb-6">MY DELIVERY ADDRESSES</h2>

        {address.map((addre) => (
          <div
            key={addre._id}
            className="bg-gray-100 p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0"
          >
            <div>
              <h3 className="font-semibold">
                {addre.fullName}{" "}
                {/* <span className="text-sm font-normal">
                  {addre.isDefault ? "(Default)" : ""}
                </span> */}
              </h3>
              <p className="text-gray-600 text-sm">{addre.phoneNumber}</p>
            </div>

            <div className="text-gray-600 text-sm mt-2 md:mt-0">
              {addre.address}, {addre.city}, {addre.state}, {addre.pinCode},{" "}
              {addre.country}
            </div>

            <div className="space-x-4 mt-2 md:mt-0">
              <button
                className="hover:underline text-sm"
                onClick={() => handleEdit(addre)}
              >
                Edit
              </button>
              <button
                className="hover:underline text-sm"
                onClick={() => {
                  setSelectedAddressId(addre._id);
                  setIsDeleteConfirmModal(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {isDeleteConfirmModal && selectedAddressId && (
          <ConfirmAlert
            type="warning"
            title="Confirm Delete"
            message="Are you sure you want to delete this address? This action cannot be undone."
            onClose={() => setIsDeleteConfirmModal(false)}
            onConfirm={() => {
              handleDelete(selectedAddressId);
              setIsDeleteConfirmModal(false);
            }}
          />
        )}

        <button
          onClick={handleAdd}
          className="bg-black text-white rounded-2xl w-50 h-10 hover:bg-white hover:text-black hover:border"
        >
          Add Address
        </button>
        {isModalOpen && (
          <AddressFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={selectedAddress}
          />
        )}
      </section>
    </div>
  );
};

export default Address;
