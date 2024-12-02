const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user'); // Adjust this path according to your project structure
const router = express.Router();

// POST route for login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and if the password matches
    if (!user) {
      return res.render('login', { message: 'Invalid email or password!' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { message: 'Invalid email or password!' });
    }

    // Save the user session after successful login
    req.session.userId = user._id;

    // Redirect user to dashboard after successful login
    res.redirect('/dashboard');  // You can change this URL to where you want to redirect after login
  } catch (error) {
    console.error(error);
    res.render('login', { message: 'An error occurred during login!' });
  }
});

// POST route for signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { message: 'User already exists!' });
    }

    // Create a new user and save to the database
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Redirect to login page after successful signup
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('signup', { message: 'An error occurred during signup!' });
  }
});

module.exports = router;
