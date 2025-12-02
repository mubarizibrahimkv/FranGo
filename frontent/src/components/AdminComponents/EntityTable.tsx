import React, { useState } from "react";
import ConfirmAlert from "../CommonComponents/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import RejectModal from "../CommonComponents/RejectModal";

interface User {
  _id: string;
  companyLogo?: string;
  profileImage?: string;
  companyName?: string;
  userName?: string;
  email: string;
  phoneNo: string;
  createdAt: Date;
  isBlocked: boolean;
  role?: "investor" | "company" | "customer";
  status?: "pending" | "approved" | "rejected";
}

interface BlockProps {
  actionType: "block";
  onAction: (id: string, isBlocked: boolean) => void | Promise<void>;
}

interface VerifyProps {
  actionType: "verify";
  onAction: (id: string, status: "approve" | "reject",reason?:string) => void | Promise<void>;
}

type Props = {
  users: User[];
} & (BlockProps | VerifyProps);

const EntityTable: React.FC<Props> = ({
  users,
  onAction,
  actionType = "block",
}) => {
  const [isConfirmationModal, setIsConfirmationModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null);
  const navigate = useNavigate();

  const handleActionClick = (user: User, action?: "approve" | "reject") => {
    setSelectedUser(user);
    setSelectedAction(action || null);
    setIsConfirmationModal(true);
  };

  const handleViewDetail = (id: string, role?: string) => {
    if (role === "company" || role === "investor") {
      navigate(`/admin/${role}/${id}`);
    }
  };

  return (
    <div className="overflow-x-auto px-4 py-2">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-[#0C2340] text-white text-base rounded-t-lg">
            <th className="px-5 py-3 text-left font-semibold rounded-tl-lg">
              Logo
            </th>
            <th className="px-5 py-3 text-left font-semibold">Name</th>
            <th className="px-5 py-3 text-left font-semibold">Email</th>
            <th className="px-5 py-3 text-left font-semibold">Mobile No</th>
            <th className="px-5 py-3 text-left font-semibold">Registered</th>
            <th className="px-5 py-3 text-left font-semibold rounded-tr-lg">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr
              key={index}
              className="bg-white rounded-lg text-[13px] font-semibold hover:shadow-md transition-all"
              onClick={() => handleViewDetail(user._id, user.role)}
            >
              <td className="px-5 py-2 rounded-l-lg">
                <img
                  src={
                    user.role === "company"
                      ? user.companyLogo
                      : user.profileImage
                  }
                  alt=""
                  className="w-7 h-7 object-contain rounded-full"
                />
              </td>
              <td className="px-5 py-2">
                {user.role === "company" ? user.companyName : user.userName}
              </td>
              <td className="px-5 py-2">{user.email}</td>
              <td className="px-5 py-2">{user.phoneNo || "Not Provided"}</td>
              <td className="px-5 py-2">
                {new Date(user.createdAt).toLocaleDateString("en-GB")}
              </td>
              <td className="px-5 py-2 rounded-r-lg relative">
                {actionType === "verify" ? (
                  <div className="relative inline-block w-32">
                    <button
                      type="button"
                      className={`w-full text-xs font-semibold px-3 py-1 rounded-full text-left flex justify-between items-center ${
                        user.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : user.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user.status === "pending") {
                          setDropdownOpen((prev) => !prev);
                          setSelectedUser(user);
                        }
                      }}
                    >
                      {(user.status || "pending").charAt(0).toUpperCase() +
                        (user.status || "pending").slice(1)}
                      {user.status === "pending" && (
                        <span className="ml-2">&#9662;</span>
                      )}
                    </button>

                    {user.status === "pending" &&
                      dropdownOpen &&
                      selectedUser?._id === user._id && (
                        <ul className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10">
                          <li
                            className="px-3 py-1 text-green-700 bg-green-100 rounded-md hover:bg-green-200 cursor-pointer text-xs font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(user, "approve");
                            }}
                          >
                            Approve
                          </li>
                          <li
                            className="px-3 py-1 text-red-700 bg-red-100 rounded-md hover:bg-red-200 cursor-pointer text-xs font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(user, "reject");
                            }}
                          >
                            Reject
                          </li>
                        </ul>
                      )}
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionClick(user);
                    }}
                    className={`w-24 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      user.isBlocked
                        ? "bg-[#0C2340]"
                        : "bg-[#0C2340] hover:bg-[#1E3A8A]"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button> 
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isConfirmationModal &&
        selectedUser &&
        (selectedAction === "reject" ? (
          <RejectModal
            isOpen={isConfirmationModal}
            onClose={() => {
              setIsConfirmationModal(false);
              setSelectedUser(null);
              setSelectedAction(null);
            }}
            onSubmit={(reason) => {
              if (!selectedUser) return;
              (
                onAction as (
                  id: string,
                  status: "approve" | "reject",
                  reason?: string
                ) => void | Promise<void>
              )(selectedUser._id, "reject", reason);

              setIsConfirmationModal(false);
              setSelectedUser(null);
              setSelectedAction(null);
            }}
          />
        ) : (
          <ConfirmAlert
            type="warning"
            title={
              actionType === "verify"
                ? selectedAction === "approve"
                  ? "Approve Company?"
                  : selectedUser.isBlocked
                  ? "Unblock Company?"
                  : "Block Company?"
                : selectedUser.isBlocked
                ? "Unblock Company?"
                : "Block Company?"
            }
            message={
              actionType === "verify"
                ? selectedAction === "approve"
                  ? "Do you want to approve this company? They will gain access to their account and features."
                  : selectedAction === "reject"
                  ? "Do you want to reject this company? They will not be able to access their account."
                  : ""
                : selectedUser.isBlocked
                ? "Do you want to unblock this company? They will regain access to their account and features."
                : "Are you sure you want to block this company? They will lose access to their account and related features."
            }
            onConfirm={() => {
              if (!selectedUser) return;

              if (actionType === "verify" && selectedAction) {
                (
                  onAction as (
                    id: string,
                    status: "approve" | "reject"
                  ) => void | Promise<void>
                )(selectedUser._id, selectedAction);
              } else if (actionType === "block") {
                (
                  onAction as (
                    id: string,
                    isBlocked: boolean
                  ) => void | Promise<void>
                )(selectedUser._id, !selectedUser.isBlocked);
              }

              setIsConfirmationModal(false);
              setSelectedUser(null);
              setSelectedAction(null);
            }}
            onClose={() => {
              setIsConfirmationModal(false);
              setSelectedUser(null);
              setSelectedAction(null);
            }}
          />
        ))}
    </div>
  );
};

export default EntityTable;
