import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

interface ISearchProp{
  onSubmit:(string:string)=>void
}

const AdminSearchBar:React.FC<ISearchProp> = ({onSubmit}) => {
  const [inputValue, setInputValue] = useState("");

  const handleButtonClick = () => {
    onSubmit(inputValue);
  };

  return (
      <div className="w-full flex items-center bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
      <input
        type="text"
        placeholder="Search here ..."
        value={inputValue}
        onChange={(e)=>setInputValue(e.target.value)}
        className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none"
      />

      <button onClick={handleButtonClick} className="bg-[#0C2340] hover:bg-[#554d6b] text-white px-9 py-3 h-full flex items-center justify-center transition-all duration-200">
        <BiSearch size={20} />
      </button>
    </div>  
  );
};

export default AdminSearchBar;
