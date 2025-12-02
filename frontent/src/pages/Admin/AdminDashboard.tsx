import React from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSlideBar";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#F6F6F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar heading="Dashboard"/>

        <main className="flex-1 p-6 overflow-y-auto bg-[#F6F6F6]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Customers</h2>
              <p className="text-3xl font-bold mt-2">120</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Companies</h2>
              <p className="text-3xl font-bold mt-2">45</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Active Subscriptions</h2>
              <p className="text-3xl font-bold mt-2">78</p>
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Reports</h2>
            <p className="text-gray-600">Coming soon..............</p>
          </div>



          
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
