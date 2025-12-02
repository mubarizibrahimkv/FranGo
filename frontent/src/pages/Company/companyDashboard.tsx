import Sidebar from "../../components/CompanyComponents/Sidebar";
import Navbar from "../../components/CompanyComponents/Navbar";
const dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar heading={"Dashboard"} />

        <main className="flex-1 p-6 mt-4 bg-gray-100 rounded-t-lg ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Card 1</h2>
              <p className="text-gray-600">Some content here...</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Card 2</h2>
              <p className="text-gray-600">Some content here...</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Card 3</h2>
              <p className="text-gray-600">Some content here...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default dashboard;
