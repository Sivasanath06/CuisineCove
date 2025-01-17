import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the LoadingSpinner component

const NearbyRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [range, setRange] = useState(100);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Unable to retrieve location. Please allow location access.");
      }
    );
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchRestaurants();
    }
  }, [latitude, longitude, range, currentPage]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/nearby-restaurants", {
        params: {
          lat: latitude,
          lng: longitude,
          range,
          page: currentPage,
          limit: 15,
        },
      });
      setRestaurants(response.data.restaurants);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
      setError("Failed to fetch nearby restaurants.");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      setError("Location not available. Please allow location access.");
      return;
    }

    setCurrentPage(1);
    fetchRestaurants();
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Nearby Restaurants
        </h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 mb-4">
            <div className="flex flex-col w-full sm:w-64">
              <label htmlFor="range" className="text-xl font-semibold mb-2">
                Range: {range} meters
              </label>
              <input
                type="range"
                id="range"
                min="50"
                max="1000"
                step="50"
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Search
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-600">
                  No restaurants found in the specified range.
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NearbyRestaurants;