import React from "react";

interface ChipProps {
  label: string;
  onDelete?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, onDelete }) => {
  return (
    <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-1 flex-shrink-0 w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
        >
          <svg
            className="w-3 h-3 text-gray-700 ml-[2px]"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chip;
