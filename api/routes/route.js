const express = require("express");
const Restaurant = require("../model/schema.js");
const router = express.Router();
const { getDistance } = require("geolib");

// Get all restaurants with pagination
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build search query
    const searchQuery = search ? { name: new RegExp(search, "i") } : {};

    // Fetch the data with pagination and search filter
    const restaurants = await Restaurant.find(searchQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    // Count total documents with search filter
    const count = await Restaurant.countDocuments(searchQuery);

    res.json({
      restaurants,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

router.get("/nearby-restaurants", async (req, res) => {
  const { lat, lng, range, page = 1, limit = 15 } = req.query;

  if (!lat || !lng || !range) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const restaurants = await Restaurant.find({});
    const nearbyRestaurants = restaurants.filter((restaurant) => {
      const restLat = parseFloat(restaurant.location.latitude);
      const restLng = parseFloat(restaurant.location.longitude);
      const distance = haversineDistance(lat, lng, restLat, restLng);
      return distance <= parseFloat(range);
    });

    // Pagination
    const totalResults = nearbyRestaurants.length;
    const totalPages = Math.ceil(totalResults / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + parseInt(limit), totalResults);
    const paginatedRestaurants = nearbyRestaurants.slice(startIndex, endIndex);

    res.json({
      totalResults,
      totalPages,
      currentPage: parseInt(page),
      restaurants: paginatedRestaurants,
    });
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.delete("/delete-duplicates", async (req, res) => {
  try {
    // Step 1: Find all documents grouped by the unique field and get the duplicates
    const duplicates = await Restaurant.aggregate([
      {
        $group: {
          _id: "$name", // Replace "$name" with the field that should be unique
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 }, // Find groups with more than one document
        },
      },
    ]);

    // Step 2: Delete duplicates, keeping the first instance
    for (const duplicate of duplicates) {
      // Keep the first document
      const [firstId, ...otherIds] = duplicate.ids;
      // Delete the rest
      await Restaurant.deleteMany({ _id: { $in: otherIds } });
    }

    res.json({ message: "Duplicate documents removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/top-100", async (req, res) => {
  try {
    // Find and sort restaurants by rating and city, then limit to the top 100
    const topRestaurants = await Restaurant.find()
      .sort({
        "user_rating.aggregate_rating": -1, // Sort by aggregate_rating in descending order
        // Sort by city in ascending order
      })
      .limit(100) // Limit the result to top 100 restaurants
      .allowDiskUse(true); // Enable external sorting to handle large datasets

    // Check if any restaurants were found
    if (topRestaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }

    res.json(topRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/top-30", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "Please provide a city name" });
  }

  try {
    // Find restaurants in the specified city and sort by aggregate_rating in descending order
    const topRestaurants = await Restaurant.find({ "location.city": city })
      .sort({ "user_rating.aggregate_rating": -1 }) // Sort by aggregate_rating in descending order
      .limit(30) // Limit the result to top 30 restaurants
      .allowDiskUse(true); // Enable external sorting if needed

    // Check if any restaurants were found
    if (topRestaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found in this city" });
    }

    res.json(topRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// API route for filtering restaurants
router.get('/filter', async (req, res) => {
  try {
      const { name, country, cuisines, minAvgCost, maxAvgCost, page = 1, limit = 5 } = req.query;

      let query = {};

      if (name) {
          query.name = { $regex: new RegExp(name, 'i') };
      }

      if (country) {
          query['location.country'] = { $regex: new RegExp(country, 'i') };
      }

      if (cuisines) {
          query.cuisines = { $regex: new RegExp(cuisines, 'i') };
      }

      if (minAvgCost || maxAvgCost) {
          query.average_cost_for_two = {};
          if (minAvgCost) {
              query.average_cost_for_two.$gte = parseInt(minAvgCost);
          }
          if (maxAvgCost) {
              query.average_cost_for_two.$lte = parseInt(maxAvgCost);
          }
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const restaurants = await Restaurant.find(query).skip(skip).limit(parseInt(limit));
      const totalRestaurants = await Restaurant.countDocuments(query);
      const totalPages = Math.ceil(totalRestaurants / parseInt(limit));

      res.json({ restaurants, pages: totalPages, totalRestaurants });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
});
router.get("/city", async (req, res) => {
  const { city } = req.query;
  const { page = 1, limit = 30 } = req.query;

  if (!city) {
    return res.status(400).json({ error: "Please provide a city name" });
  }

  try {
    const restaurants = await Restaurant.find({ "location.city": city })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .exec();
    const count = await Restaurant.countDocuments({ "location.city": city });

    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: req.params.id });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
