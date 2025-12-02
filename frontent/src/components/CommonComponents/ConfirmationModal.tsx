import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ConfirmAlertProps {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
  type,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  const icons = {
    success: <CheckCircle className="text-green-500 w-12 h-12" />,
    error: <XCircle className="text-red-500 w-12 h-12" />,
    warning: <AlertTriangle className="text-yellow-500 w-12 h-12" />,
  };

  const colors = {
    success: "bg-green-600 hover:bg-green-700",
    error: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-500 hover:bg-yellow-600",
  };

  const borderColors = {
    success: "border-white-500",
    error: "border-white-500",
    warning: "border-white-500",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center border-4 ${borderColors[type]}`}
      >
        <div className="flex justify-center mb-4">{icons[type]}</div>

        <h3 className="text-lg font-semibold mb-2 text-black">{title}</h3>

        <p className="text-gray-600 text-sm mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 text-sm font-medium rounded-lg text-white ${colors[type]} transition`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmAlert;
