const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

// GET /api/users/:id - Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: req.params.id }).sort({
      createdAt: -1,
    });

    res.json({ ...user._doc, posts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
