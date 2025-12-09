import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { getCategories } from "../../services/admin/manageUsers";
import type { IIndustryCategory } from "../../types/admin";
import type { IFilters } from "../../pages/Investor/ExploreFranchise";

interface FilterPanelProps {
  onClose: () => void;
  onApply: (filters: IFilters) => void;
  appliedFilters?: IFilters;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onClose,
  onApply,
  appliedFilters,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    appliedFilters?.selectedCategories || [],
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    appliedFilters?.selectedLocations || [],
  );
  const [selectedOwnership, setSelectedOwnership] = useState<string[]>(
    appliedFilters?.selectedOwnership || [],
  );
  const [minFee, setMinFee] = useState(appliedFilters?.minFee || "");
  const [maxFee, setMaxFee] = useState(appliedFilters?.maxFee || "");
  const [newLocation, setNewLocation] = useState("");
  const [categories, setCategories] = useState<IIndustryCategory[]>([]);

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedOwnership([]);
    setMinFee("");
    setMaxFee("");

    onApply({
      selectedCategories: [],
      selectedLocations: [],
      selectedOwnership: [],
      minFee: "",
      maxFee: "",
    });
  };

  useEffect(() => {
    setSelectedCategories(appliedFilters?.selectedCategories || []);
    setSelectedLocations(appliedFilters?.selectedLocations || []);
    setSelectedOwnership(appliedFilters?.selectedOwnership || []);
    setMinFee(appliedFilters?.minFee || "");
    setMaxFee(appliedFilters?.maxFee || "");
  }, [appliedFilters]);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategories();
      console.log(res.industries);
      setCategories(res.industries);
    };
    fetchCategory();
  }, []);

  const handleAddLocation = () => {
    if (newLocation.trim() && !selectedLocations.includes(newLocation.trim())) {
      setSelectedLocations((prev) => [...prev, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const ownershipModels = ["COCO", "COFO", "FOFO"];

  const toggleSelection = (
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value],
    );
  };

  const handleApply = () => {
    onApply({
      selectedCategories,
      selectedLocations,
      selectedOwnership,
      minFee,
      maxFee,
    });
  };

  return (
    <div className="fixed inset-10 bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] rounded-2xl shadow-xl p-6 space-y-5 border">
        <div className="flex justify-between items-center border-b pb-3">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <X size={22} />
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Reset
          </button>

          <button
            onClick={handleApply}
            className="text-gray-600 hover:text-green-600 transition"
          >
            <Check size={22} />
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories?.map(
              (cat) =>
                cat._id && (
                  <button
                    key={cat._id}
                    onClick={() =>
                      cat._id &&
                      toggleSelection(
                        cat._id,
                        selectedCategories,
                        setSelectedCategories,
                      )
                    }
                    className={`px-3 py-1 text-sm rounded-full border ${
                      selectedCategories.includes(cat._id)
                        ? "bg-[#023430] text-white border-[#023430]"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                ),
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Location</h3>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Type location..."
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm 
                 text-gray-800 placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-[#023430] bg-white"
            />
            <button
              onClick={handleAddLocation}
              className="bg-[#023430] text-white px-4 py-2 rounded-lg hover:bg-[#035c4d] transition text-sm"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedLocations.map((loc) => (
              <button
                key={loc}
                onClick={() =>
                  toggleSelection(loc, selectedLocations, setSelectedLocations)
                }
                className={`px-3 py-1 text-sm rounded-full border ${
                  selectedLocations.includes(loc)
                    ? "bg-[#023430] text-white border-[#023430]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Ownership Model</h3>
          <div className="flex flex-wrap gap-2">
            {ownershipModels.map((model) => (
              <button
                key={model}
                onClick={() =>
                  toggleSelection(
                    model,
                    selectedOwnership,
                    setSelectedOwnership,
                  )
                }
                className={`px-3 py-1 text-sm rounded-full border ${
                  selectedOwnership.includes(model)
                    ? "bg-[#023430] text-white border-[#023430]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Filter by Fee (₹)
          </h3>

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Min"
              value={minFee}
              onChange={(e) => setMinFee(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm 
                 text-gray-800 placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-[#023430] bg-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm 
                 text-gray-800 placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-[#023430] bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
