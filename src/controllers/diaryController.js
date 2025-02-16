const Diary = require("../models/Diary");

// ✅ Add a new diary entry
exports.addDiaryEntry = async (req, res) => {
  try {
    const { lawyer, title, description, date } = req.body;
    const entry = new Diary({ lawyer, title, description, date });
    await entry.save();
    res.status(201).json({ message: "Diary entry added", entry });
  } catch (error) {
    res.status(500).json({ message: "Error adding diary entry", error });
  }
};

// ✅ Get all diary entries of a lawyer
exports.getDiaryEntries = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const entries = await Diary.find({ lawyer: lawyerId }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching diary entries", error });
  }
};

// ✅ Get diary entries by a specific date
exports.getDiaryByDate = async (req, res) => {
  try {
    const { lawyerId, date } = req.params;
    const entries = await Diary.find({ lawyer: lawyerId, date: new Date(date) });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching diary entries", error });
  }
};

// ✅ Update a diary entry
exports.updateDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = await Diary.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Diary entry updated", updatedEntry });
  } catch (error) {
    res.status(500).json({ message: "Error updating diary entry", error });
  }
};

// ✅ Delete a diary entry
exports.deleteDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await Diary.findByIdAndDelete(id);
    res.status(200).json({ message: "Diary entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting diary entry", error });
  }
};
