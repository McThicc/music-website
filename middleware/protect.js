const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // I know I need to change this remind me later
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token, authorization denied' });
  }
};

module.exports = protect;
