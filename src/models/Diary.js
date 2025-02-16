const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("Diary", diarySchema);
