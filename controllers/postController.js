const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Post text is required" });
  }

  try {
    const post = await Post.create({ text, author: req.user.id });
    res.status(201).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Post creation failed", error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.json(posts);
};

exports.getUserPosts = async (req, res) => {
  const posts = await Post.find({ author: req.params.id }).populate(
    "author",
    "name"
  );
  res.json(posts);
};
