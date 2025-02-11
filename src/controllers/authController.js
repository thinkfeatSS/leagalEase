const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, city, role, specialization, experience, description } = req.body;

    // Check Required Fields
    if (!name || !email || !password || !city || !role) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // Check if User Already Exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload Profile Image to Cloudinary
    const profileImage = req.file ? req.file.path : "";

    // Create New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      city,
      role,
      profileImage,
      profile: role === "lawyer" ? { specialization, experience, description } : {},
    });

    await newUser.save();
    res.status(201).json({ message: "Registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login =  async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ msg: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

exports.getUserProfile =  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }