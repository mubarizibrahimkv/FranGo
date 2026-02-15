import { useSelector } from "react-redux";
import Navbar from "../../components/InvestorComponents/Navbar";
import type { RootState } from "../../redux/store/store";

const Investory = () => {
  // const investorId = useSelector((state: RootState) => state.user._id);
  return (
    <div>
      <Navbar />
      <div></div>
    </div>
  );
};

export default Investory;
