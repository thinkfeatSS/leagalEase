const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from the header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: "authorization denied" });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
