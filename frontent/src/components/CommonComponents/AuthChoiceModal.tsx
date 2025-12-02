import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

const AuthChoiceModal: React.FC<Props> = ({ onClose }) => {
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
          Welcome to Franchise Management Portal
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Please choose an option to continue:
        </p>

        <div className="text-center mb-4">
          <p className="text-gray-700 text-sm mb-2">Login as:</p>
          <a
            href="/investor/login"
            className="block w-full py-2 mb-2 text-center bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#265D97] transition"
          >
            Investor Login
          </a>
          <a
            href="/company/login"
            className="block w-full py-2 text-center bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#265D97] transition"
          >
            Company Login
          </a>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-700 text-sm mb-2">
            New here? Create an account.
          </p>
          <a
            href="/register"
            className="block w-full py-2 mb-3 text-center bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#3B91C3] transition"
          >
            Start A Business Today <br /> (Investor Registration)
          </a>
          <a
            href="company/register"
            className="block w-full py-2 bg-[#1F3C58] text-white rounded-lg shadow hover:bg-[#3B91C3] transition"
          >
            Appoint Channel Partners <br /> (Franchiser Registration)
          </a>
        </div>

        <div className="bg-green-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">
            Why Register ?
          </h3>
          <p className="text-xs text-gray-600">
            Gain access to manage franchises, track performance, and connect
            with partners — all in one place. Stay organized and grow your
            business efficiently.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthChoiceModal;
