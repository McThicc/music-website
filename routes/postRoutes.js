const express = require('express');
const Post = require('../model/model');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure storage for uploaded files
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
    // Fetch posts (without sorting by createdAt) and reverse them in memory
    const posts = await Post.find();
    const reversedPosts = posts.reverse(); // Reverse the posts array
    const username = req.session.username || null; 
    res.render('index', { message, error, posts: reversedPosts, username });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).render('index', { error: 'Error fetching posts', message: null, posts: [], username: null });
  }
}


// GET route for the home page (only one now)
router.get('/', (req, res) => renderIndex(req, res));

// GET route for the new post form page
router.get('/new', (req, res) => {
  const username = req.session.username || null;
  res.render('newPost', { username }); 
});

// POST route for creating a new post
router.post('/', upload.single('image'), async (req, res) => {
  const { description } = req.body;
  const image = req.file.filename;

  try {
    await Post.create({
      image,
      description,
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error uploading post.');
  }
});

// GET route for login page
router.get('/login', (req, res) => res.render('login', { message: null }));

// GET route for sign-up page
router.get('/signup', (req, res) => res.render('signup', { message: null }));

module.exports = router;
