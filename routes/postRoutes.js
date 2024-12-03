const express = require('express');
const Post = require('../model/model');
const router = express.Router();

// Function to render the index page with posts and comments
async function renderIndex(req, res, message = null, error = null) {
  try {
    const posts = await Post.find(); // Fetch all posts from the database
    const username = req.session.username || null; // Get username if logged in
    res.render('index', { message, error, posts, username });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).render('index', { error: 'Error fetching posts', message: null, posts: [], username: null });
  }
}

// GET route for the home page
router.get('/', (req, res) => renderIndex(req, res));

// POST route for adding a comment
router.post('/post', async (req, res) => {
  const { comments } = req.body;
  const username = req.session.username || 'Anonymous'; // Fallback for guest users

  if (!comments || comments.trim() === '') {
    return renderIndex(req, res, null, 'Comment cannot be empty.');
  }

  try {
    const post = await Post.findOne(); // Assuming a single post exists
    if (!post) return res.status(404).send('Post not found');

    // Add comment to the post's comments array
    post.comments.push({ username, text: comments });
    await post.save();

    res.redirect('/'); // Redirect back to index after saving
  } catch (err) {
    console.error('Error saving comment:', err);
    renderIndex(req, res, null, 'Error saving comment.');
  }
});

// GET route for login page
router.get('/login', (req, res) => res.render('login', { message: null }));

// GET route for sign-up page
router.get('/signup', (req, res) => res.render('signup', { message: null }));

module.exports = router;
