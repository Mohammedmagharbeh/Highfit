const express = require("express");
const router = express.Router();
const {
  getNutrition,
  updateNutrition,
  saveAllNutrition,
  deleteNutrition,
} = require("../controller/nutritionController");

// GET all nutrition programs
router.get("/", getNutrition);

// PUT update specific nutrition program
router.put("/:programId", updateNutrition);

// POST bulk save nutrition programs
router.post("/bulk", saveAllNutrition);

// DELETE specific nutrition program
router.delete("/:programId", deleteNutrition);

module.exports = router;
