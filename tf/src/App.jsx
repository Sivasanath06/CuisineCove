import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import TopRestaurants from "./pages/TopRestaurants";
import CitySearch from "./pages/CitySearch";
import NearbyRestaurants from "./pages/NearbyRestaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import ImageSearch from "./pages/GetCusine";
import Footer from "./components/Footer"; // Import Footer component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/top-restaurants" element={<TopRestaurants />} />
        <Route path="/city-search" element={<CitySearch />} />
        <Route path="/nearby-restaurants" element={<NearbyRestaurants />} />
        <Route path="/image" element={<ImageSearch />} />
      </Routes>

     
      <Footer />
    </Router>
  );
};

export default App;