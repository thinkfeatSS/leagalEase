const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  city: { type: String, required: true },
  role: { type: String, enum: ["user", "lawyer","admin"], default: "user" },
  profile: {
    specialization: { type: String },
    experience: { type: String },
    description: { type: String },
  },
});


// Indexing for better search performance
userSchema.index({ name: "text", "profile.specialization": "text", city: "text" });
module.exports = mongoose.model("User", userSchema);
