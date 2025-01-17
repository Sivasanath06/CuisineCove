import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the LoadingSpinner component

const TopRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/top-100");
        setRestaurants(res.data);
      } catch (err) {
        setError("Error fetching top restaurants");
        console.error("Error fetching top restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRestaurants();
  }, []);

  if (loading) return <LoadingSpinner />;  // Use the loading spinner
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Top 100 Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopRestaurants;