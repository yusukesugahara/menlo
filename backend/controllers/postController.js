const Post = require('../models/post');
const Profile = require('../models/profile'); 

const getPosts = async (req, res) => {
  const keywordQuery = req.query.keywords ;

  try {
    let posts;
    if (keywordQuery) {
      posts = await Post.find({ keywords: { $in: keywordQuery.split(' ') }})
                        .populate('author', 'username');
    } else {
      posts = await Post.find()
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

const createPost = async (req, res) => {
  const { title, content, keywords } = req.body;
  
  if (!title || !content || !keywords || keywords.length === 0) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (keywords.length > 5) {
    return res.status(400).json({ message: "You can specify up to 5 keywords." });
  }

  try {
    const newPost = new Post({
      title,
      content,
      keywords,
      author: req.userId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err.message); 
    res.status(500).json({ message: err.message });
  }
};

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

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You do not have permission to edit this post.' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.keywords = req.body.keywords || post.keywords;

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

const getUserPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await Post.find({ author: userId })
    const postWithLikeCount = posts.map(post => ({
      ...post._doc,
      likesCount: post.likes.length, 
    }));

    res.json(postWithLikeCount);


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes.push(req.userId); 
    await post.save();

    res.json({ message: 'Post liked', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'You have not liked this post yet' });
    }

    post.likes = post.likes.filter(userId => userId.toString() !== req.userId);
    await post.save();

    res.json({ message: 'Post unliked', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostsByAuthor = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.authorId })
                                  .populate('author','username')
                                  .populate('keywords');
    const postWithLikeCount = posts.map(post => ({
      ...post._doc,
      likesCount: post.likes.length, 
    }));
    const profile = await Profile.findOne({ user: req.params.authorId }).select('bio');

    if (!profile) {
      return res.status(404).json({ message: 'プロフィールが見つかりません。' });
    }

    res.json({postWithLikeCount, bio: profile.bio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getKeywordStatistics = async (req, res) => {
  try {
    const keywordStats = await Post.aggregate([
      { $unwind: "$keywords" }, 
      { $group: { _id: "$keywords", count: { $sum: 1 } } }, 
      { $sort: { count: -1 } }, 
      { $limit: 20 } 
    ]);

    res.json(keywordStats);
  } catch (err) {
    console.error('Error fetching keyword statistics:', err.message);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
};


const searchPosts = async (req, res) => {
  const { query } = req.query;
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, 
        { content: { $regex: query, $options: 'i' } },
        { keywords: { $regex: query, $options: 'i' } }  
      ]
    }).populate('author', 'username');

    const postWithLikeCount = posts.map(post => ({
      ...post._doc,
      likesCount: post.likes.length, 
    }));

    res.json(postWithLikeCount);
  } catch (err) {
    console.error('Error searching posts:', err.message);
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
  getPostsByAuthor,
  getKeywordStatistics,
  searchPosts,
};
