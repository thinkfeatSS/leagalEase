const express = require("express");
const { addDiaryEntry, getDiaryEntries, getDiaryByDate, updateDiaryEntry, deleteDiaryEntry } = require("../controllers/diaryController");
const router = express.Router();

// Routes
router.post("/add", addDiaryEntry);
router.get("/all/:lawyerId", getDiaryEntries);
router.get("/date/:lawyerId/:date", getDiaryByDate);
router.put("/update/:id", updateDiaryEntry);
router.delete("/delete/:id", deleteDiaryEntry);

module.exports = router;
