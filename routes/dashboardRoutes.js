const express = require('express');
const router = express.Router();
const Post = require('../model/model');


// Middleware to ensure user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.username) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }
  next();
}

// GET route for the dashboard page
router.get('/', isAuthenticated, async (req, res) => {
  const username = req.session.username;

  try {
    // Fetch posts by the logged-in user
    const userPosts = await Post.find({ username }).sort({ createdAt: -1 }); // Sort by newest first
    res.render('dashboard', { username, posts: userPosts });
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.render('dashboard', { username, posts: [], error: 'Error fetching your posts.' });
  }
});

// Delete post route
router.delete('/delete-post/:id', async (req, res) => {
  console.log('DELETE request received for post ID:', req.params.id); // Debugging line
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);
    res.redirect('/dashboard'); // Redirect to the dashboard after deletion
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Error deleting post');
  }
});


module.exports = router;
                      