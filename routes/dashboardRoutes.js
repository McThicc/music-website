const express = require('express');
const router = express.Router();

// Middleware to ensure user is logged in (for protected routes)
function isAuthenticated(req, res, next) {
  if (!req.session.username) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }
  next();
}

// GET route for the dashboard page
router.get('/', isAuthenticated, (req, res) => {
  const username = req.session.username;
  res.render('dashboard', { username });
});

module.exports = router;
