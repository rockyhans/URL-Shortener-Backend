const express = require("express");
const {
  createPost,
  getPosts,
  getUserPosts,
} = require("../controllers/postController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/user/:id", getUserPosts);

module.exports = router;
