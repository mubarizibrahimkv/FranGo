import loginImage from "../../assets/loginPage.png";
import ForgetPassword from "../../components//AuthForms/ForgotPassword";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full h-110 max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="w-1/2 flex flex-col items-center justify-center bg-[#023430]">
          <h6 className="text-3xl font-bold  text-white mb-2">FranGo</h6>
          <p className="text-sm text-white opacity-75 mb-6 font-serif">
            Connecting You to the Best Franchise Opportunities
          </p>
          <img
            src={loginImage}
            alt="register"
            className="w-70 object-contain"
          />
        </div>
        <ForgetPassword />
      </div>
    </div>
  );
};

export default ForgotPassword;
