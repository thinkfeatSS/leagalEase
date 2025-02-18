const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, city, role, specialization, experience, description,contact } = req.body;

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
      contact,
      profileImage,
      profile: role === "lawyer" ? { specialization, experience, description } : {},
    });

    await newUser.save();
    res.status(201).json({ message: "Registered successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//  Login user
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
    console.log(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

//  Get user Profile
exports.getUserProfile =  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
exports.getLawyerProfile =  async (req, res) => {
  try {
    const { name, city, specialization, page = 1, limit = 100} = req.query;

    const query = { role: "lawyer" };

    if (name) query.name = new RegExp(name, "i"); // Case-insensitive search
    if (city) query.city = new RegExp(city, "i");
    if (specialization) query["profile.specialization"] = new RegExp(specialization, "i");

    const lawyers = await User.find(query)
      .select("-password") // Exclude password for security
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 }); // Latest lawyers first

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      lawyers,
    });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, city, specialization, experience, description,contact } = req.body;
    const userId = req.user.id; // Get user ID from authenticated request

    // Find the user by ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update basic fields
    if (name) user.name = name;
    if (city) user.city = city;
    if (contact) user.city = contact;
    
    // Update profile image if uploaded
    if (req.file) {
      user.profileImage = req.file.path;
    }

    // Update lawyer-specific fields
    if (user.role === "lawyer") {
      if (specialization) user.profile.specialization = specialization;
      if (experience) user.profile.experience = experience;
      if (description) user.profile.description = description;
    }

    // Save the updated user profile
    await user.save();
    
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};
