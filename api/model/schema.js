const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  has_online_delivery: Number,
  photos_url: String,
  url: String,
  price_range: Number,
  apikey: String,
  user_rating: {
    rating_text: String,
    rating_color: String,
    votes: String,
    aggregate_rating: String,
  },
  R: {
    res_id: Number,
  },
  name: String,
  has_table_booking: Number,
  is_delivering_now: Number,
  deeplink: String,
  menu_url: String,
  average_cost_for_two: Number,
  switch_to_order_menu: Number,
  offers: [Schema.Types.Mixed], // Array of mixed types if offers are complex
  cuisines: String,
  location: {
    address: String,
    city: String,
    country_id: Number,
    locality_verbose: String,
    city_id: Number,
    zipcode: String,
    locality: String,
    country: String,
    latitude: String,
    longitude: String,
  },
  featured_image: String,
  currency: String,
  id: String,
  thumb: String,
  establishment_types: [String], // Array of strings
  events_url: String,
});

// Create a 2dsphere index on the location field to enable geospatial queries

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
