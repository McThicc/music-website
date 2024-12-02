const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your secret key
    req.user = decoded; // Attach the user info (like userId) to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token, authorization denied' });
  }
};

module.exports = protect;
