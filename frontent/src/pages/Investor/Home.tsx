import { useSelector } from "react-redux";
import Footer from "../../components/InvestorComponents/Footer";
import Navbar from "../../components/InvestorComponents/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { RootState } from "../../redux/store/store";
import bannerImage from "../../assets/banner image.png";
import image1 from "../../assets/banner 2.png";
import image2 from "../../assets/banner 3.png";
import allensollyLogo from "../../assets/allensolly logo.png";
import { BiSolidCategory } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { IoGlobeOutline } from "react-icons/io5";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { GrDocumentText } from "react-icons/gr";

const Home = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );
  const role = useSelector((state: RootState) => state.user.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "customer") {
      navigate("/");
    } else {
      navigate("/customer");
    }
  }, [isAuthenticated, navigate, role]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Navbar />

      <div className="bg-[#1F3C58] text-white rounded-b-[60px] flex h-160 p-10">
        <div className="w-1/2 flex flex-col items-start justify-center gap-7 mx-10">
          <h1 className="font-serif text-5xl font-bold">
            Start Your Franchise
            <br />
            Journey Today with
            <br /> FranGo
          </h1>
          <p className="text-gray-300 mt-14">
            Explore opportunities with verified brands across India.
          </p>
          <button className="bg-[#4DA8DA] rounded-[10px] text-black p-3 hover:bg-[#3B91C3] transition-colors duration-200">
            Explore Franchises
          </button>
        </div>
        <div className="w-1/2 items-center justify-center flex">
          <img src={bannerImage} alt="" className="w-120" />
        </div>
      </div>

      {/* Choose for user and company */}
      <div className="flex items-center justify-center mt-20 m-10 gap-7">
        <div className="bg-[#DBFDFA] w-[500px] p-8 rounded-lg shadow flex items-center">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">
              Looking for a Franchise?
            </h2>
            <p className="text-gray-700 text-base mt-4 mb-6 leading-relaxed min-h-[96px]">
              Explore top brands and
              <br />
              apply for franchise
              <br />
              opportunities.
            </p>
            <button className="bg-[#01EC64] rounded-[10px] text-black px-6 py-2 hover:bg-[#00c853] transition-colors duration-200">
              Franchises
            </button>
          </div>
          <img src={image1} alt="" className="w-45 object-contain ml-4" />
        </div>
        <div className="bg-[#DBFDFA] w-[500px] p-8 rounded-lg shadow flex items-center">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">
              Are You a Brand? Expand Through Franchising
            </h2>
            <p className="text-gray-700 text-base mt-4 mb-6 leading-relaxed min-h-[96px]">
              Post franchise opportunities and
              <br />
              receive applications from
              <br />
              potential partners.
            </p>
            <button className="bg-[#01EC64] rounded-[10px] text-black px-6 py-2 hover:bg-[#00c853] transition-colors duration-200">
              Franchises
            </button>
          </div>
          <img src={image2} alt="" className="w-40 object-contain ml-4" />
        </div>
      </div>

      {/* Trending cards */}
      <div className="flex flex-col mb-10 mt-20">
        <h1 className="text-3xl font-bold text-black mx-25 mb-8 text-start">
          Trending Franchises
        </h1>
        <div className="flex justify-center-safe gap-5 mt-4">
          <div className="w-[320px] rounded-[10px] border-2 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center p-4 gap-2 hover:scale-102 cursor-pointer">
            <img
              src={allensollyLogo}
              alt=""
              className="w-30 h-30 object-contain rounded-full mb-8 shadow"
            />
            <hr className="w-full border-t-1  my-2" />
            <p className="text-base font-bold text-[#023430]">Allen Solly</p>
            <p className="text-gray-500 text-xs italic mb-1">
              The fun side of formal
            </p>
            <p className="flex items-center gap-1 text-[#023430] text-xs">
              <BiSolidCategory className="text-black" />
              Category: <span className="font-semibold">Food</span>
            </p>
            <p className="flex items-center gap-1 text-[#023430] text-xs">
              <FaLocationDot className="text-black" />
              Location: <span className="font-semibold">All India</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button className="border border-black text-[#023430] w-28 h-10 rounded-[10px]  px-3 py-1 font-semibold hover:bg-[#DBFDFA] transition-colors duration-200 text-xs">
                View Details
              </button>
              <button className="bg-[#011E2B] text-white w-28 h-10 rounded-[10px] px-3 py-1 font-semibold hover:bg-[#023430] transition-colors duration-200 text-xs">
                Apply
              </button>
            </div>
          </div>
          <div className="w-[320px] rounded-[10px] border-2 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center p-4 gap-2 hover:scale-102 cursor-pointer">
            <img
              src={allensollyLogo}
              alt=""
              className="w-30 h-30 object-contain rounded-full mb-8 shadow"
            />
            <hr className="w-full border-t-1  my-2" />
            <p className="text-base font-bold text-[#023430]">Allen Solly</p>
            <p className="text-gray-500 text-xs italic mb-1">
              The fun side of formal
            </p>
            <p className="flex items-center gap-1 text-[#023430] text-xs">
              <BiSolidCategory className="text-black" />
              Category: <span className="font-semibold">Food</span>
            </p>
            <p className="flex items-center gap-1 text-[#023430] text-xs">
              <FaLocationDot className="text-black" />
              Location: <span className="font-semibold">All India</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button className="border border-black text-[#023430] w-28 h-10 rounded-[10px]  px-3 py-1 font-semibold hover:bg-[#DBFDFA] transition-colors duration-200 text-xs">
                View Details
              </button>
              <button className="bg-[#011E2B] text-white w-28 h-10 rounded-[10px] px-3 py-1 font-semibold hover:bg-[#023430] transition-colors duration-200 text-xs">
                Apply
              </button>
            </div>
          </div>
          <div className="w-[320px] rounded-[10px] border-2 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center p-4 gap-2 hover:scale-102 cursor-pointer">
            <img
              src={allensollyLogo}
              alt=""
              className="w-30 h-30 object-contain rounded-full mb-8 shadow"
            />
            <hr className="w-full border-t-1  my-2" />
            <p className="text-base font-bold text-[#023430]">Allen Solly</p>
            <p className="text-gray-500 text-xs italic mb-1">
              The fun side of formal
            </p>
            <p className="flex items-center gap-1 text-[#023430] text-xs">
              <BiSolidCategory className="text-black" />
              Category: <span className="font-semibold">Food</span>
            </p>
            <p className="flex items-center gap-1 text-[#023430] text-xs">
              <FaLocationDot className="text-black" />
              Location: <span className="font-semibold">All India</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button className="border border-black text-[#023430] w-28 h-10 rounded-[10px]  px-3 py-1 font-semibold hover:bg-[#DBFDFA] transition-colors duration-200 text-xs">
                View Details
              </button>
              <button className="bg-[#011E2B] text-white w-28 h-10 rounded-[10px] px-3 py-1 font-semibold hover:bg-[#023430] transition-colors duration-200 text-xs">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why choose us */}
      <div className="bg-[#011E2B] text-white px-10 py-10 mb-20">
        <h1 className="text-3xl font-bold mb-8 text-start">Why Choose Us</h1>

        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="border rounded-2xl p-6 flex flex-col items-start gap-3 max-w-sm">
            <IoGlobeOutline className="text-[#01EC64] text-3xl" />
            <p className="font-semibold text-lg">Quick and easy search</p>
            <p className="text-sm text-gray-200">
              Find the best franchises in just a few clicks. Our platform is
              designed for ease of use, helping you make quick and informed
              decisions.
            </p>
          </div>

          <div className="border rounded-2xl p-6 flex flex-col items-start gap-3 max-w-sm">
            <GrDocumentText className="text-[#01EC64] text-3xl" />
            <p className="font-semibold text-lg">Verified Listings</p>
            <p className="text-sm text-gray-200">
              All listings are reviewed and verified to ensure authenticity and
              reliability before you invest your time or money.
            </p>
          </div>

          <div className="border rounded-2xl p-6 flex flex-col items-start gap-3 max-w-sm">
            <AiOutlineDollarCircle className="text-[#01EC64] text-3xl" />
            <p className="font-semibold text-lg">Best ROI Opport unities</p>
            <p className="text-sm text-gray-200">
              We highlight franchises with proven performance and great return
              on investment, saving you time and risk.
            </p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-8 text-start">Why Choose Us</h1>
        <h2>Class not found</h2>
      </div>

      <Footer />
    </>
  );
};

export default Home;
