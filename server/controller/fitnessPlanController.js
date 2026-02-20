const FitnessPlan = require("../models/FitnessPlan");

// @desc    Get all fitness plans as a dictionary
// @route   GET /api/plans
exports.getPlans = async (req, res) => {
  try {
    const plansArray = await FitnessPlan.find();

    // Convert DB array to the Exact Dictionary shape expected by React
    const plansData = {};
    plansArray.forEach((plan) => {
      plansData[plan.planId] = plan;
    });

    res.status(200).json(plansData);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Save/Update entirely the specific plan structure
// @route   PUT /api/plans/:planId
exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const planData = req.body;

    // Ensure we do not accidentally overwrite the nested `_id` unless absolutely necessary,
    // though Mongoose handles this gracefully on `findOneAndUpdate` if it lacks strict IDs.
    const updatedPlan = await FitnessPlan.findOneAndUpdate(
      { planId: planId },
      planData,
      { new: true, upsert: true }, // Create if doesn't exist
    );

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error updating plan:", error);
    res
      .status(500)
      .json({ message: "Failed to update plan", error: error.message });
  }
};

// @desc    Bulk Save all plans at once (Utility endpoint for massive saves)
// @route   POST /api/plans/bulk
exports.saveAllPlans = async (req, res) => {
  try {
    const plansDict = req.body;

    for (const [key, val] of Object.entries(plansDict)) {
      val.planId = key;
      await FitnessPlan.findOneAndUpdate({ planId: key }, val, {
        upsert: true,
        new: true,
      });
    }

    res
      .status(200)
      .json({ message: "All plans saved successfully to database!" });
  } catch (err) {
    console.error("Error saving bulk plans:", err);
    res.status(500).json({ error: err.message });
  }
};
