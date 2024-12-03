// This file is by far one of the most infuriating things I've ever made, it works and I can kind of understand what's going on but its defiently not optimal 
const express = require('express');
const Post = require('../model/model');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configures the storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create the upload middleware
const upload = multer({ storage });

// Function to render the index page with posts
async function renderIndex(req, res, message = null, error = null) {
  try {
    // Fetch posts and reverse them in memory
    const posts = await Post.find();
    const reversedPosts = posts.toReversed();
    const username = req.session.username || null; 
    const userId = req.session.userId || null;
    
    res.render('index', { message, error, posts: reversedPosts, username, userId });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).render('index', { error: 'Error fetching posts', message: null, posts: [], username: null });
  }
}



// The GET route for the home page (only one now)
router.get('/', (req, res) => renderIndex(req, res));

// The GET route for the new post form page
router.get('/new', (req, res) => {
  const username = req.session.username || null;
  res.render('newPost', { username }); 
});

// The POST route for creating a new post
router.post('/', upload.single('image'), async (req, res) => {
  const { description } = req.body;
  const image = req.file.filename;
  const userId = req.session.userId;
  const username = req.session.username || 'Anonymous';

  try {
    await Post.create({
      image,
      description,
      username,
      likedBy: [],
      likes: 0,
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error uploading post.');
  }
});

// The POST route for liking a post
router.post('/like/:postId', async (req, res) => {
  const postId = req.params.postId;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(403).send('You must be logged in to like a post');
  }

  try {
    const post = await Post.findById(postId);

    if (post.likedBy.includes(userId)) {
      // User has already liked this post, so this will unlike it
      post.likedBy = post.likedBy.filter(user => user.toString() !== userId);
      post.likes--;
    } else {
      // User hasn't liked this post, so this will like it
      post.likedBy.push(userId);
      post.likes++;
    }

    await post.save();

    res.redirect('/'); // Refreshes the page
  } catch (error) {
    console.error('Error liking the post:', error);
    res.status(500).send('Error liking the post');
  }
});

router.post('/post/comment/:id', async (req, res) => {
  const postId = req.params.id;
  const { comments } = req.body;

  try {
    const post = await Post.findById(postId);

    // Ensure the comments array is initialized
    if (!post.comments) {
      post.comments = [];
    }

    // Add the new comment
    post.comments.push({
      username: req.session.username || 'Anonymous',
      content: comments,
    });

    // Save the post with the new comment
    await post.save();
    res.json(post.comments[post.comments.length - 1]);

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});

// The GET route for login page
router.get('/login', (req, res) => res.render('login', { message: null }));

// The GET route for sign-up page
router.get('/signup', (req, res) => res.render('signup', { message: null }));

module.exports = router;
