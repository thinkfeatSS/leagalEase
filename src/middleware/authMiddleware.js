const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied, token missing' });
  } 

  try {
    // Verify the token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Bearer <token>
    req.user = decoded;  // Add the user info to the request object
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ success: false, message: 'Invalid token'});
  }
};

// Role-based authorization
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have access to this resource' });
    }
    next();
  };
};