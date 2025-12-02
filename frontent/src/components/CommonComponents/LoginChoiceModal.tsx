import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

const LoginChoiceModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-black/50 via-gray-800/30 to-black/50 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-center text-gray-900 mb-4">
          Welcome Back!
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Please choose how you’d like to log in:
        </p>

        <div className="text-center mb-6">
          <a
            href="/investor/login"
            className="block w-full py-2 mb-3 text-center bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#3B91C3] transition"
          >
            Investor Login
          </a>
          <a
            href="/customer/login"
            className="block w-full py-2 mb-3 text-center bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#3B91C3] transition"
          >
            Customer Login
          </a>
          <a
            href="/company/login"
            className="block w-full py-2 text-center bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#3B91C3] transition"
          >
            Franchiser Login
          </a>
        </div>

        <div className="bg-blue-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">
            Not Registered Yet?
          </h3>
          <p className="text-xs text-gray-600 mb-2">
            You can create a new account to start your business journey.
          </p>
          <a
            href="/register"
            className="text-sm font-medium text-[#1F3C58] hover:underline"
          >
            Go to Registration Options →
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginChoiceModal;
