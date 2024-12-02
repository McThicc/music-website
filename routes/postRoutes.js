// routes/postRoutes.js

const express = require('express');
const Post = require('../model/model');
const router = express.Router();

// GET route for the home page
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { message: null, error: null, posts });
  } catch (err) {
    console.error('Error fetching post data:', err);
    res.status(500).render('index', { error: 'Error fetching post data', posts: [] });
  }
});

// POST route for adding a post
router.post('/post', async (req, res) => {
  try {
    const newPost = new Post({
      comments: req.body.comments,
    });
    await newPost.save();
    res.render('index', { message: 'Post data saved successfully!', error: null, posts: await Post.find() });
  } catch (err) {
    console.error('Error saving post data:', err);
    res.status(500).render('index', { error: 'Error saving post data', message: null, posts: [] });
  }
});


module.exports = router;