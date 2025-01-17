import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../components/logo.jpeg';  // Local logo image import

const MainPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Separate states for each search input
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [cuisines, setCuisines] = useState("");
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/filter", {
          params: {
            name,
            country,
            cuisines,
            minAvgCost: minCost,
            maxAvgCost: maxCost,
            page: currentPage,
            limit: 5,
          },
        });
        setRestaurants(res.data.restaurants);
        setTotalPages(res.data.pages);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchRestaurants();
  }, [name, country, cuisines, minCost, maxCost, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* Background Image with Navbar */}
      <div
        className="bg-cover bg-center h-screen"
        style={{
          backgroundImage:
            "url('https://b.zmtcdn.com/web_assets/81f3ff974d82520780078ba1cfbd453a1583259680.png')",
        }}
      >
        <div className="inset-0 bg-black opacity-10"></div>

        {/* Navbar */}
        <nav className="top-0 left-0 w-full bg-transparent p-4 shadow-md transition-all duration-300 z-20">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-white">
              <img
                src={logo} // Local image used here
                alt="Logo"
                className="h-20" // Increased logo size
              />
            </Link>
            <div className="flex items-center space-x-6 sm:hidden">
              <button onClick={() => setIsOpen(!isOpen)}>
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 ${isOpen ? 'block' : 'hidden'} sm:hidden`}>
              <div className="relative bg-white w-64 h-full">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4"
                >
                  <XMarkIcon className="h-6 w-6 text-black" />
                </button>
                <div className="flex flex-col p-4 space-y-4">
                  <Link to="/" className="text-black">Home</Link>
                  <Link to="/top-restaurants" className="text-black">Top 100</Link>
                  <Link to="/city-search" className="text-black">Search By City</Link>
                  <Link to="/nearby-restaurants" className="text-black">Nearby Restaurants</Link>
                  <Link to="/image" className="text-black">Image Search</Link>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex flex-col sm:flex-row sm:space-x-6 mt-4 sm:mt-0 w-full sm:w-auto">
              <Link to="/" className="text-white py-2 hover:text-gray-400">Home</Link>
              <Link to="/top-restaurants" className="text-white py-2 hover:text-gray-400">Top 100</Link>
              <Link to="/city-search" className="text-white py-2 hover:text-gray-400">Search By City</Link>
              <Link to="/nearby-restaurants" className="text-white py-2 hover:text-gray-400">Nearby Restaurants</Link>
              <Link to="/image" className="text-white py-2 hover:text-gray-400">Image Search</Link>
            </div>
          </div>
        </nav>

        {/* Search Section */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-black p-4 sm:p-8">
          <h1 className="text-2xl font-bold mb-4 text-white">Discover the best food & drinks</h1>
          <form
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 mb-2"
              placeholder="Search by name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 mb-2"
              placeholder="Search by country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 mb-2"
              placeholder="Search by cuisines"
              value={cuisines}
              onChange={(e) => setCuisines(e.target.value)}
            />
            <input
              type="number"
              className="w-full px-4 py-2 rounded-md border border-gray-300 mb-2"
              placeholder="Min Avg Cost"
              value={minCost}
              onChange={(e) => setMinCost(e.target.value)}
            />
            <input
              type="number"
              className="w-full px-4 py-2 rounded-md border border-gray-300 mb-2"
              placeholder="Max Avg Cost"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default MainPage;