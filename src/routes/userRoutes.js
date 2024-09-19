const express = require('express');
const {registerUser, loginUser} = require('../controllers/userController');
const { verifyToken,authorizeRoles } = require('../middleware/authMiddleware');

const router  = express.Router();
// // POST
router .post('/register',registerUser);
router .post('/login',loginUser);
// // GET
router .get('/protected-route', verifyToken, (req, res) => {
    res.json({
      success: true,
      message: `Welcome ${req.user.email}, you have access to this protected route`,
    });
  });
  router .get('/admin-route', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.json({
      success: true,
      message: 'Welcome admin, you have access to this admin route',
    });
  });

module.exports = router ;
