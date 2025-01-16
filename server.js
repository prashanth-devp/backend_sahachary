const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/dist");

// Initialize app
const app = express();

app.use(express.static(buildPath));

const corsOptions = {
  origin: "*", // Frontend port
  methods: "GET,POST",
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGO_URI =
  "mongodb+srv://prashanthpotragalla:sahachary1856@cluster0.sed9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Email schema and model
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

const Email = mongoose.model("Email", emailSchema);

// API routes
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const newSubscription = new Email({ email });
    await newSubscription.save();
    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email is already subscribed" });
    }
    console.error("Error occurred:", err); // Log the error
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
