import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchInput("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search facilities by name..."
          value={searchInput}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-3 outline-none text-gray-900 placeholder-gray-500"
        />
        {searchInput && (
          <button
            onClick={handleClear}
            className="pr-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        )}
      </div>
      {/* {searchInput && resultCount !== undefined && (
        <div className="mt-2 text-sm text-gray-600 bg-white rounded-lg px-4 py-2 shadow-lg border border-gray-200">
          Found <span className="font-semibold text-gray-900">{resultCount}</span> result{resultCount !== 1 ? "s" : ""}
        </div>
      )} */}
    </div>
  );
};

export default SearchBar;
