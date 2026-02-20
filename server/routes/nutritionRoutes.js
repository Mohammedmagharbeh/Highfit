const express = require("express");
const router = express.Router();
const {
  getNutrition,
  updateNutrition,
  saveAllNutrition,
} = require("../controller/nutritionController");

// GET all nutrition programs
router.get("/", getNutrition);

// PUT update specific nutrition program
router.put("/:programId", updateNutrition);

// POST bulk save nutrition programs
router.post("/bulk", saveAllNutrition);

module.exports = router;
