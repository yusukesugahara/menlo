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
        posts = await Post.find({ category: category._id })
                            .populate('category')
                            .populate('author', 'username');
      } else {
        posts = [];
      }
    } else {
      posts = await Post.find()
                        .populate('category')
                        .populate('author', 'username');
    }

    const postWithLikeCount = posts.map(post => ({
      ...post._doc,
      likesCount: post.likes.length, 
    }));

    res.json(postWithLikeCount);
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
      author: req.userId,  // 認証されたユーザーのIDを保存
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

    // 投稿者かどうかを確認
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You do not have permission to edit this post.' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) =>{

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 投稿者かどうかを確認
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this post.' });
    }

    await Post.findByIdAndDelete(req.params.id);
    console.log('Post deleted successfully');
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ユーザーの投稿一覧を取得
const getUserPosts = async (req, res) => {
  try {
    const userId = req.userId;  // authMiddlewareによって付与されるuserId
    const posts = await Post.find({ author: userId }).populate('category');  // ユーザーIDに基づいて投稿を検索
    const postWithLikeCount = posts.map(post => ({
      ...post._doc,
      likesCount: post.likes.length, 
    }));

    res.json(postWithLikeCount);


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 「いいね」を追加する
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 既に「いいね」していないか確認
    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes.push(req.userId); // ユーザーIDを「いいね」リストに追加
    await post.save();

    res.json({ message: 'Post liked', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 「いいね」を解除する
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // まだ「いいね」していない場合
    if (!post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'You have not liked this post yet' });
    }

    post.likes = post.likes.filter(userId => userId.toString() !== req.userId); // ユーザーIDを「いいね」リストから削除
    await post.save();

    res.json({ message: 'Post unliked', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
  likePost,
  unlikePost,
};
