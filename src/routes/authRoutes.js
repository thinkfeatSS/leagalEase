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

// // Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ error: "User not found" });

//   const validPassword = await bcrypt.compare(password, user.password);
//   if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

//   const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
//   res.json({ token, user });
// });

// // @route   GET /api/auth/user (Protected)

router.get('/lawyer', authMiddleware, roleMiddleware(['lawyer']), (req, res) => {
    res.json({ msg: 'Welcome, lawyer!' });
  });
module.exports = router;
