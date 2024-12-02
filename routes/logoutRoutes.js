// logoutRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out. Try again later.');
    }
    res.redirect('/'); // Redirect to home page
  });
});

module.exports = router;
