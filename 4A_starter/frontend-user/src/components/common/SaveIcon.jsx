import React from 'react'

const SaveIcon = ({ handleSave}) => {
  return (
    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-primary" onClick={handleSave}>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </button>
  )
}

export default SaveIcon