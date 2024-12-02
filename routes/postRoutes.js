const express = require('express');
const Post = require('../model/model');
const router = express.Router();

// Function to render the index page with comments
async function renderIndex(req, res, message = null, error = null) {
  try {
    // Fetching the first post (you can modify if there are multiple posts)
    const post = await Post.findOne();  // Fetches the first post from the database
    const comments = post ? post.comments : [];  // Extracting comments from the post

    const username = req.session.username || null;  // Get the username from the session
    res.render('index', { message, error, comments, username });
  } catch (err) {
    console.error('Error fetching post data:', err);
    res.status(500).render('index', { error: 'Error fetching comments', message: null, comments: [], username: null });
  }
}

// GET route for the home page
router.get('/', (req, res) => renderIndex(req, res));

// POST route for adding a comment to the post
router.post('/post', async (req, res) => {
  const { commentText } = req.body;
  const username = req.session.username;

  if (!commentText || commentText.trim() === '') {
    return renderIndex(req, res, null, 'Comment cannot be empty.');  // Fixed the order of arguments here
  }

  try {
    // Retrieve the first post (assuming one post for now)
    const post = await Post.findOne();
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Add the comment to the post's comments array
    post.comments.push({ username, text: commentText });
    await post.save();

    // Redirect to the home page (index)
    res.redirect('/');
  } catch (err) {
    console.error('Error saving comment:', err);
    renderIndex(req, res, null, 'Error saving comment');
  }
});

// GET route for login page
router.get('/login', (req, res) => {
  res.render('login', { message: null });
});

// GET route for sign-up page
router.get('/signup', (req, res) => {
  res.render('signup', { message: null });
});

module.exports = router;
