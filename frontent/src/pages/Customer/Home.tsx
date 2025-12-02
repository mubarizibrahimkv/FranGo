import Navbar from "../../components/CustomerComponents/Navbar";
const CustomerHomePage = () => {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to FranGo Shop!</h1>
        <p>Here you can explore products, franchises, and more.</p>
      </main>
    </div>
  );
};

export default CustomerHomePage;
