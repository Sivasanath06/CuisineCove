require('dotenv').config(); // Ensure dotenv is loaded first
const fs = require("fs");
const mongoose = require("mongoose");
const Restaurant = require("./model/schema");

// Log the Mongo URI to verify it's being read correctly
console.log('Mongo URI:', process.env.MONGO_URI); // Log the Mongo URI

// Load the data from file1 (and additional files if needed)
const file1 = JSON.parse(fs.readFileSync("file5.json"));
// const file2 = JSON.parse(fs.readFileSync("file2.json"));
// const file3 = JSON.parse(fs.readFileSync("file3.json"));
// const file4 = JSON.parse(fs.readFileSync("file4.json"));
// const file5 = JSON.parse(fs.readFileSync("file5.json"));

// Merge the objects and remove any items with API limit exceeded message
const mergedObject = { ...file1 };
for (const key in mergedObject) {
  if (mergedObject[key].message === "API limit exceeded") {
    delete mergedObject[key];
  }
}

// Extract restaurant names
let restaurantNames = [];
for (const key in mergedObject) {
  if (mergedObject[key].restaurants) {
    const names = mergedObject[key].restaurants.map((r) => r.restaurant);
    restaurantNames = restaurantNames.concat(names);
  }
}
console.log(restaurantNames.length);

// Country mapping for restaurants
const countryMapping = {
  1: "India",
  14: "Australia",
  30: "Brazil",
  37: "Canada",
  94: "Indonesia",
  148: "New Zealand",
  162: "Phillipines",
  166: "Qatar",
  184: "Singapore",
  189: "South Africa",
  191: "Sri Lanka",
  208: "Turkey",
  214: "UAE",
  215: "United Kingdom",
  216: "United States",
};

// Function to update country names in the restaurant objects
const updateCountryNames = (restaurants) => {
  return restaurants.map((restaurant) => {
    if (restaurant.location && countryMapping[restaurant.location.country_id]) {
      restaurant.location.country = countryMapping[restaurant.location.country_id];
    }
    return restaurant;
  });
};

// Update the country names
const updatedRestaurants = updateCountryNames(restaurantNames);
console.log(updatedRestaurants);

// Mongoose connection and insertion handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000, // 60 seconds
  socketTimeoutMS: 60000,          // 60 seconds
})
.then(() => {
  console.log("Connected to MongoDB...");

  // Function to insert restaurants in batches
  const insertRestaurantsInBatches = async (restaurants, batchSize = 100) => {
    const operations = [];
    let batchCount = 0;
    
    for (let i = 0; i < restaurants.length; i++) {
      operations.push({
        insertOne: {
          document: restaurants[i],
        },
      });
      if (operations.length === batchSize || i === restaurants.length - 1) {
        try {
          const result = await Restaurant.bulkWrite(operations, { w: 1 });
          batchCount++;
          console.log(`Inserted batch ${batchCount}:`, result);
          operations.length = 0; // Reset operations for the next batch
        } catch (err) {
          console.error(`Error inserting batch ${batchCount}:`, err);
        }
      }
    }
  };

  // Start inserting restaurants in batches
  insertRestaurantsInBatches(updatedRestaurants)
    .then(() => {
      console.log("All restaurants inserted successfully!");
      process.exit(0); // Exit the process after all insertions are done
    })
    .catch((err) => {
      console.error("Error during batch insertion:", err);
      process.exit(1); // Exit with an error status if insertion fails
    });

}).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit with an error status if MongoDB connection fails
});

// You can export mergedObject for use elsewhere if needed
module.exports = mergedObject;