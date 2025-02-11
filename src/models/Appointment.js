const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed", "completed"], default: "pending" },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
