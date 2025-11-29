"use client";

import { useEffect, useState, FormEvent, KeyboardEvent } from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search quotes...",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const submitSearch = () => {
    const trimmed = inputValue.trim();
    onSearchChange(trimmed);
  };

  const handleClear = () => {
    setInputValue("");
    if (searchQuery !== "") {
      onSearchChange("");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSearch();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  return (
    <div className="mb-6">
      <form className="relative" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 pl-12 pr-28 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm bg-white text-gray-800 placeholder-gray-400"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-semibold text-purple-600 hover:text-purple-700"
        >
          Search
        </button>
      </form>
    </div>
  );
}

