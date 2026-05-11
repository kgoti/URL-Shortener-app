// ============================================================
// models/Url.js — Mongoose schema for a shortened URL
//
// Each document stores:
//   originalUrl — the full long URL the user pasted in
//   code        — the short random string (e.g. "xK3p9q")
//   shortUrl    — the full short URL (e.g. "http://localhost:5000/xK3p9q")
//   clicks      — how many times the short URL has been visited
//   createdAt   — timestamp added automatically by Mongoose
// ============================================================

const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,   // no two URLs can share the same short code
    },
    shortUrl: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,     // starts at zero, increments every time it is visited
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Url", urlSchema);
