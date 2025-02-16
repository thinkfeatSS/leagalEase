const express = require("express");
const upload = require("../middleware/upload");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
// Register User or Lawyer

const router = express.Router();
// Register Route
router.post("/register", upload.single("profileImage"), authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getUserProfile);
router.get("/lawyers", authMiddleware, authController.getLawyerProfile);
router.put("/updateprofile", authMiddleware, authController.updateProfile);

router.get('/lawyer', authMiddleware, roleMiddleware(['lawyer']), (req, res) => {
    res.json({ msg: 'Welcome, lawyer!' });
  });
module.exports = router;