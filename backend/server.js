// ============================================================
// server.js — Entry point for the URL Shortener backend
//
// Two types of routes:
//   /api/urls  → create and list short URLs (from the React frontend)
//   /:code     → redirect — when someone visits a short URL
//                e.g. http://localhost:5000/abc123
//                → looks up the code and redirects to the original URL
// ============================================================

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
require("dotenv").config();

const urlRoutes = require("./routes/urls");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ──────────────────────────────────────────────
// Handles: POST /api/urls  and  GET /api/urls
app.use("/api/urls", urlRoutes);

// ── Redirect Route ──────────────────────────────────────────
// This is the core feature: visiting a short URL redirects
// the user to the original long URL
//
// Example: GET http://localhost:5000/xK3p9q
// → finds the URL document with code "xK3p9q"
// → increments click count
// → redirects user to the original URL
const Url = require("./models/Url");

app.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ code: req.params.code });

    if (!url) {
      // No matching short code found — show a helpful message
      return res.status(404).json({ message: "Short URL not found or has expired." });
    }

    // Increment the click counter every time the short URL is visited
    url.clicks += 1;
    await url.save();

    // 301 = permanent redirect, 302 = temporary redirect
    // We use 302 so browsers don't cache it (better for tracking clicks)
    res.redirect(302, url.originalUrl);

  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ── Health check ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "URL Shortener API is running!" });
});

// ── Connect to MongoDB and start ────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
