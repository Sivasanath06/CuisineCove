import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard"; // Import the RestaurantCard component

const CitySearch = () => {
  const [city, setCity] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRestaurants = async (page) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/city`, {
        params: { city, page },
      });

      console.log("API Response:", res.data); // Debugging line

      if (res.data && Array.isArray(res.data.restaurants)) {
        setRestaurants(res.data.restaurants || []);
        setTotalPages(res.data.totalPages || 0);
        setCurrentPage(parseInt(res.data.currentPage) || 1);
      } else {
        setRestaurants([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]);
      setTotalPages(0);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchRestaurants(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="flex mb-8">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No restaurants found.
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;