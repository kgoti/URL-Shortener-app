// ============================================================
// routes/urls.js — URL API Routes
//
// POST /api/urls      → shorten a new URL
// GET  /api/urls      → get all shortened URLs (for the history table)
// DELETE /api/urls/:id → delete a shortened URL
// ============================================================

const express  = require("express");
const { nanoid } = require("nanoid"); // generates short random strings
const Url      = require("../models/Url");

const router = express.Router();

// ── Helper: check if a URL string is valid ──────────────────
// We use the built-in URL class to validate
// "https://google.com" is valid
// "not a url" is not valid
const isValidUrl = (str) => {
  try {
    const url = new URL(str);
    // Only allow http and https — not ftp://, file:// etc.
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// ── POST /api/urls ──────────────────────────────────────────
// Receives { originalUrl } in the request body
// Returns the created URL document including the short code
router.post("/", async (req, res) => {
  const { originalUrl } = req.body;

  // Validate the URL before doing anything
  if (!originalUrl) {
    return res.status(400).json({ message: "Please provide a URL." });
  }

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({
      message: "Invalid URL. Make sure it starts with http:// or https://",
    });
  }

  try {
    // Check if this exact URL has already been shortened
    // If yes, return the existing short URL instead of creating a duplicate
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.json(existing);
    }

    // nanoid(6) generates a random 6-character string like "xK3p9q"
    // This becomes the short code
    const code     = nanoid(6);
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    // Save to MongoDB
    const url = await Url.create({ originalUrl, code, shortUrl });
    res.status(201).json(url);

  } catch (err) {
    res.status(500).json({ message: "Server error. Could not shorten URL." });
  }
});

// ── GET /api/urls ───────────────────────────────────────────
// Returns all shortened URLs, newest first
// Used by the frontend to show the history table
router.get("/", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch URLs." });
  }
});

// ── DELETE /api/urls/:id ────────────────────────────────────
// Deletes a shortened URL by its MongoDB _id
router.delete("/:id", async (req, res) => {
  try {
    const url = await Url.findByIdAndDelete(req.params.id);
    if (!url) {
      return res.status(404).json({ message: "URL not found." });
    }
    res.json({ message: "URL deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete URL." });
  }
});

module.exports = router;
