import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-4 mt-8">
      <div className="container mx-auto flex flex-col items-center sm:flex-row justify-between">
        <div className="text-center sm:text-left">
          <p className="font-bold">CuisineCove</p>
          <p className="text-sm">Discover the best food, restaurants, and cuisines around you</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex justify-center space-x-6">
            <Link to="/" className="hover:text-gray-400">Home</Link>
            <Link to="/top-restaurants" className="hover:text-gray-400">Top 100</Link>
            <Link to="/city-search" className="hover:text-gray-400">Search By City</Link>
            <Link to="/nearby-restaurants" className="hover:text-gray-400">Nearby Restaurants</Link>
            <Link to="/image" className="hover:text-gray-400">Image Search</Link>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm">© {new Date().getFullYear()} CuisineCove. All rights reserved.</p>
        <p className="text-sm mt-2">Made by Sivasanath Kumar M</p>
      </div>
    </footer>
  );
};

export default Footer;