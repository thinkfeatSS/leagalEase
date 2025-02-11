const roleMiddleware = (roles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // The user object is already available from the auth middleware
  
      if (!roles.includes(userRole)) {
        return res.status(403).json({ msg: 'Access denied. You do not have permission to access this resource.' });
      }
  
      next(); // Proceed to the next middleware or route handler
    };
  };
  
  
  module.exports = roleMiddleware;
  