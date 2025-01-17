const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const restaurantRoutes = require("./routes/route.js");
var cors = require("cors");
const multer = require("multer");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Restaurant = require("./model/schema.js");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000,         // 45 seconds
})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", restaurantRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/getcuisine", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Construct file path
    const filePath = path.join(__dirname, "uploads", file.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).send("File was not saved correctly.");
    }

    // Upload file to file manager
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: file.mimetype,
      displayName: file.originalname,
    });

    const fileUri = uploadResult.file.uri;

    // Get AI model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Generate content from AI model
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: file.mimetype,
          fileUri: fileUri,
        },
      },
      {
        text: "Identify the type of Cuisine in this picture. Just Cuisine name. nothing else is required",
      },
    ]);

    // Extract cuisine from result
    const cuisine = result.response.text().trim();

    // Get pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15; // Default limit to 15

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Fetch restaurants based on cuisine with pagination
    const restaurants = await Restaurant.find({
      cuisines: { $regex: new RegExp(cuisine, "i") },
    })
      .skip(skip)
      .limit(limit)
      .exec();

    // Count total restaurants for pagination
    const totalRestaurants = await Restaurant.countDocuments({
      cuisines: { $regex: new RegExp(cuisine, "i") },
    }).exec();
    const totalPages = Math.ceil(totalRestaurants / limit);

    // Return response with pagination information
    res.json({
      cuisine: cuisine,
      restaurants: restaurants,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalRestaurants: totalRestaurants,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});
