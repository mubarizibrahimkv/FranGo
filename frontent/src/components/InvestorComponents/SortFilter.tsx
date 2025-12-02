import React, { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const SortFilter: React.FC = () => {
  const [selectedField, setSelectedField] = useState("investment");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const handleOrderChange = (value: "asc" | "desc") => setOrder(value);

  const handleFieldChange = (value: string) => setSelectedField(value);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 w-64">
      <p className="text-sm font-medium text-gray-600 mb-3">Sort by</p>

      <div className="flex flex-col gap-2 mb-4 text-sm text-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sortField"
            value="investment"
            checked={selectedField === "investment"}
            onChange={() => handleFieldChange("investment")}
            className="accent-blue-500"
          />
          Total Investment
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sortField"
            value="revenue"
            checked={selectedField === "revenue"}
            onChange={() => handleFieldChange("revenue")}
            className="accent-blue-500"
          />
          Avg Monthly Revenue
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sortField"
            value="date"
            checked={selectedField === "date"}
            onChange={() => handleFieldChange("date")}
            className="accent-blue-500"
          />
          Date
        </label>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => handleOrderChange("asc")}
          className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg border transition ${
            order === "asc"
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <ArrowUp size={16} /> Ascending
        </button>

        <button
          onClick={() => handleOrderChange("desc")}
          className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg border transition ${
            order === "desc"
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <ArrowDown size={16} /> Descending
        </button>
      </div>
    </div>
  );
};

export default SortFilter;
