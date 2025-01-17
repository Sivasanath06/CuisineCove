import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
          currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        First
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
          currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-700 font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
          currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        Next
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
          currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;