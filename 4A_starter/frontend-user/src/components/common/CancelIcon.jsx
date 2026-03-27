import React from 'react'

const CancelIcon = ({ handleCancel }) => {
  return (
    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500" onClick={handleCancel}>
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )
}

export default CancelIcon