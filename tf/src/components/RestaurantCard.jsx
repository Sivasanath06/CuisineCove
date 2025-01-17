import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={restaurant.thumb}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{restaurant.name}</h2>
        <p className="text-sm text-gray-600">{restaurant.cuisines}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className="text-green-600 font-bold mr-2">{restaurant.user_rating.aggregate_rating} ★</span>
            <span className="text-gray-600">{restaurant.currency}{restaurant.average_cost_for_two} for two</span>
          </div>
          <div className="flex items-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                restaurant.has_online_delivery ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={restaurant.has_online_delivery ? 'Online Delivery Available' : 'No Online Delivery'}
            ></span>
            <span className="ml-2 text-sm text-gray-600">
              {restaurant.has_online_delivery ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-blue-500 text-white text-center py-2">
        <Link to={`/restaurant/${restaurant.id}`}>
          <button className="hover:bg-blue-600 px-4 py-2 text-white font-bold rounded">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;