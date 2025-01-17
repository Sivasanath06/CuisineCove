import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the LoadingSpinner component

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <LoadingSpinner />;  // Use the loading spinner

  if (!restaurant) return <p>Restaurant not found.</p>;

  const {
    name,
    location = {},
    user_rating = {},
    cuisines,
    average_cost_for_two,
    currency,
    photos_url,
    menu_url,
    featured_image,
    has_online_delivery,
  } = restaurant;

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center">{name}</h1>
          <img
            src={featured_image}
            alt={name}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          <div className="text-center">
            <p className="text-lg mb-2">
              <strong>Address:</strong> {location.address || "Not available"}
            </p>
            <p className="text-lg mb-2">
              <strong>City:</strong> {location.city || "Not available"}
            </p>
            <p className="text-lg mb-2">
              <strong>Country:</strong> {location.country || "Not available"}
            </p>
            <p className="text-lg mb-2 flex justify-center items-center">
              <strong>Rating:</strong>
              <span className="ml-2">
                {user_rating.aggregate_rating || "Not available"}
              </span>
              <FaStar className="text-green-500 ml-2" />
              <span className="ml-2">
                ({user_rating.votes || "0"} ratings)
              </span>
            </p>
            <p className="text-lg mb-2 flex justify-center items-center">
              <span
                className={`px-2 py-1 rounded text-white`}
                style={{ backgroundColor: `#${user_rating.rating_color}` }}
              >
                {user_rating.rating_text || "Not available"}
              </span>
            </p>
            <p className="text-lg mb-2">
              <strong>Cuisines:</strong> {cuisines || "Not available"}
            </p>
            <p className="text-lg mb-2">
              <strong>Average Cost for Two:</strong> 
              {average_cost_for_two
                ? `${currency}${average_cost_for_two}`
                : "Not available"}
            </p>
            <p className="text-lg mb-2 flex justify-center items-center">
              <strong>Online Delivery:</strong>
              <FaCircle
                className={`ml-2 ${
                  has_online_delivery === 1 ? "text-green-500" : "text-red-500"
                }`}
              />
              <span className="ml-2">
                {has_online_delivery === 1 ? "Available" : "Not Available"}
              </span>
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <a
                href={photos_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300"
              >
                Photos
              </a>
              <a
                href={menu_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300"
              >
                Menu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;