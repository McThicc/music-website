const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');

// POST route for login
router.post('/', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render('login', { message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('login', { message: 'Invalid credentials' });
      }

      
  
      // Store user information in session (e.g., username or the entire user object)
      req.session.userId = user._id;
      req.session.username = user.username;  // Storing username in session
  
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.render('login', { message: 'Error during login, please try again.' });
    }
  });

module.exports = router;
