// routes/signUpRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../model/user');

// POST route for user signup
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { message: 'Email already registered.' });
    }

    // Create new user and save to the database
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Redirect to the login page after successful sign-up
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('signup', { message: 'Error during signup, please try again.' });
  }
});

module.exports = router;
