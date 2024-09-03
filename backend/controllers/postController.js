const Post = require('../models/post');
const Category = require('../models/category');

// Get all posts
const getPosts = async (req, res) => {
  const categoryName = req.query.category;

  try {
    let posts;
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        posts = await Post.find({ category: category._id }).populate('category');
      } else {
        posts = [];
      }
    } else {
      posts = await Post.find().populate('category');
    }
    res.json(posts);
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Create a new post
const createPost = async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const newPost = new Post({
      title,
      content,
      category,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err.message); 
    res.status(500).json({ message: err.message });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = req.body.title;
    post.content = req.body.content;
    post.category = req.body.category;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
};
