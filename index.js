import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { nanoid } from "nanoid";
import Url from "./models/Url.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Helper: validate URL
function isValidUrl(urlString) {
  try {
    // new URL will throw if invalid
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}

// POST /api/shorten
app.post("/api/shorten", async (req, res) => {
  const { longUrl, customCode } = req.body;
  if (!longUrl || !isValidUrl(longUrl)) {
    return res.status(400).json({ error: "Invalid or missing longUrl" });
  }

  let shortCode = customCode ? String(customCode).trim() : nanoid(7);

  for (let i = 0; i < 5; i++) {
    const exists = await Url.findOne({ shortCode });
    if (!exists) break;
    shortCode = nanoid(7);
    if (i === 4)
      return res.status(500).json({ error: "Could not generate unique code" });
  }

  try {
    const urlDoc = new Url({
      longUrl,
      shortCode,
    });
    await urlDoc.save();

    const shortUrl = `${BASE_URL}/${shortCode}`;
    return res.json({ shortCode, shortUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Redirect route GET /:shortcode
app.get("/:shortcode", async (req, res) => {
  const { shortcode } = req.params;
  const urlDoc = await Url.findOne({ shortCode: shortcode });
  if (!urlDoc) {
    return res.status(404).send("Short URL not found");
  }

  urlDoc.clicks = (urlDoc.clicks || 0) + 1;
  urlDoc.lastVisited = new Date();
  await urlDoc.save();

  return res.redirect(urlDoc.longUrl);
});

// Admin middleware (simple header-based auth for demo)
const adminAuth = (req, res, next) => {
  const secret = req.headers["x-admin-secret"];
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Admin: list all shortened URLs
app.get("/api/admin/urls", adminAuth, async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 }).lean();
  res.json(urls);
});

// Admin: delete a short URL
app.delete("/api/admin/urls/:shortcode", adminAuth, async (req, res) => {
  const { shortcode } = req.params;
  await Url.findOneAndDelete({ shortCode: shortcode });
  res.json({ success: true });
});

// Serve client in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}`);
});
