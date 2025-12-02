import logo from "../../assets/fullLogo.png";
import { GrInstagram } from "react-icons/gr";
import { FaLinkedin } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-[#071621] text-white py-10 px-6 font-sans">
            <div className="flex mt-10 justify-between">
                <div className="">
                    <img src={logo} alt="" className="w-40" />
                    <p className="text-gray-400 text-sm mt-4">Address: [Kerala, India]</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="/">Home</a></li>
                        <li><a href="/">How it works</a></li>
                        <li><a href="/">Explore Application</a></li>
                        <li><a href="/">My Application</a></li>
                        <li><a href="/">Saved</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">About</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="/">FAQ</a></li>
                        <li><a href="/">Testimonial</a></li>
                        <li><a href="/">Our Mission</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Contact</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>📧 support@frango.com</li>
                        <li>📞 +91-9087654321</li>
                        <div className="flex gap-3 text-blue-500"><GrInstagram /><FaLinkedin /><FaSquareXTwitter /></div>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Legal</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="/">Terms & Conditions</a></li>
                        <li><a href="/">Privacy Policy</a></li>
                        <li><a href="/">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-600 mt-10 pt-4 text-center text-sm text-orange-500">© {new Date().getFullYear()} FranGo. All rights reserved.</div>
        </footer>
    );
};

export default Footer;
