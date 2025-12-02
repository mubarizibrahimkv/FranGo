import React from "react";
import { Bell } from "lucide-react";

interface NavbarProps {
  heading: string;
}

const AdminNavbar: React.FC<NavbarProps> = ({ heading }) => {
  return (
    <header className="w-full h-16 bg-white flex items-center justify-between px-8 shadow-md sticky top-0 z-50">
      <h2 className="text-2xl font-extrabold font-serif text-gray-800">
        {heading}
      </h2>
      <div className="flex items-center space-x-6">
        <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
