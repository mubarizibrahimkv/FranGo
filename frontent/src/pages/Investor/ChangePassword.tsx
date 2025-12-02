import loginImage from "../../assets/loginPage.png";
import ChangePasswordComponent from "../../components/AuthForms/ChangePasswordComponent";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="w-1/2 flex flex-col items-center justify-center bg-[#023430] text-center p-6">
          <h6 className="text-3xl font-bold text-white mb-2">FranGo</h6>
          <p className="text-sm text-white opacity-75 mb-6 font-serif">
            Connecting You to the Best Franchise Opportunities
          </p>
          <img
            src={loginImage}
            alt="change password"
            className="w-72 object-contain"
          />
        </div>

        <div className="w-1/2 bg-white flex flex-col justify-center p-8">
          <div className="max-w-md w-full mx-auto">
            <ChangePasswordComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
