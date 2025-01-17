import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from './logo.jpeg';  // Import your local image here

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="top-0 left-0 w-full bg-transparent p-4 shadow-md transition-all duration-300 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-black">
          <img
            src={logo} // Use the imported local image here
            alt="Logo"
            className="h-16" // Increased size to make the logo more visible
          />
        </Link>
        <div className="flex items-center space-x-6 sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Bars3Icon className="h-6 w-6 text-black" />
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
          <Link to="/" className="text-black py-2 hover:text-gray-400">Home</Link>
          <Link to="/top-restaurants" className="text-black py-2 hover:text-gray-400">Top 100</Link>
          <Link to="/city-search" className="text-black py-2 hover:text-gray-400">Search By City</Link>
          <Link to="/nearby-restaurants" className="text-black py-2 hover:text-gray-400">Nearby Restaurants</Link>
          <Link to="/image" className="text-black py-2 hover:text-gray-400">Image Search</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;