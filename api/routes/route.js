const express = require("express");
const Restaurant = require("../model/schema.js");
const { getDistance } = require("geolib");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Operations related to restaurants
 */

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get all restaurants with pagination
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           default: ""
 *     responses:
 *       200:
 *         description: A list of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const searchQuery = search ? { name: new RegExp(search, "i") } : {};

    const restaurants = await Restaurant.find(searchQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

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

/**
 * @swagger
 * /api/nearby-restaurants:
 *   get:
 *     summary: Get nearby restaurants within a specified range
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: range
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 15
 *     responses:
 *       200:
 *         description: A list of nearby restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalResults:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/top-100:
 *   get:
 *     summary: Get the top 100 restaurants based on rating
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: A list of top 100 restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get("/top-100", async (req, res) => {
  try {
    const topRestaurants = await Restaurant.find()
      .sort({
        "user_rating.aggregate_rating": -1,
      })
      .limit(100)
      .allowDiskUse(true);

    if (topRestaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }

    res.json(topRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/top-30:
 *   get:
 *     summary: Get top 30 restaurants in a specified city
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of top 30 restaurants in the specified city
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Please provide a city name
 *       404:
 *         description: No restaurants found in the city
 *       500:
 *         description: Server error
 */
router.get("/top-30", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "Please provide a city name" });
  }

  try {
    const topRestaurants = await Restaurant.find({ "location.city": city })
      .sort({ "user_rating.aggregate_rating": -1 })
      .limit(30)
      .allowDiskUse(true);

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

module.exports = router;