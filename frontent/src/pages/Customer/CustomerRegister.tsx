import RegisterForm from "../../components/AuthForms/RegiserForm";

const CustomerRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="w-1/2 flex flex-col items-center justify-center bg-[#023430] p-8">
          <h6 className="text-3xl font-bold text-white mb-2">FranGo Shop</h6>
          <p className="text-sm text-white opacity-75 mb-6 font-serif text-center">
            Explore and shop the best products from your favorite franchises.
            Create your account and start your seamless shopping experience today!
          </p>
        </div>
        <RegisterForm role="customer"/>
      </div>
    </div>
  );
};

export default CustomerRegister;
