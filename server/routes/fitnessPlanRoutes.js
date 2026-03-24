const express = require("express");
const router = express.Router();
const {
  getPlans,
  updatePlan,
  saveAllPlans,
  deletePlan,
} = require("../controller/fitnessPlanController");

// GET all plans as dictionary
router.get("/", getPlans);

// PUT single plan by planId
router.put("/:planId", updatePlan);

// POST bulk upload (to save everything at once)
router.post("/bulk", saveAllPlans);

// DELETE single plan by planId
router.delete("/:planId", deletePlan);

module.exports = router;
