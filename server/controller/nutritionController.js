const NutritionProgram = require("../models/NutritionProgram");

// @desc    Get all nutrition programs as a dictionary
// @route   GET /api/nutrition
exports.getNutrition = async (req, res) => {
  try {
    const programsArray = await NutritionProgram.find();

    const nutritionData = {};
    programsArray.forEach((prog) => {
      nutritionData[prog.programId] = {
        title: prog.title,
        desc: prog.desc,
        meals: prog.meals,
      };
    });

    res.status(200).json(nutritionData);
  } catch (error) {
    console.error("Error fetching nutrition:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update specific nutrition program
// @route   PUT /api/nutrition/:programId
exports.updateNutrition = async (req, res) => {
  try {
    const { programId } = req.params;
    const { title, desc, meals } = req.body;

    const updatedProgram = await NutritionProgram.findOneAndUpdate(
      { programId: programId },
      { title, desc, meals },
      { new: true, upsert: true },
    );

    res.status(200).json({
      title: updatedProgram.title,
      desc: updatedProgram.desc,
      meals: updatedProgram.meals,
    });
  } catch (error) {
    console.error("Error updating nutrition:", error);
    res
      .status(500)
      .json({ message: "Failed to update nutrition", error: error.message });
  }
};

// @desc    Bulk Save all nutrition programs at once
// @route   POST /api/nutrition/bulk
exports.saveAllNutrition = async (req, res) => {
  try {
    const nutritionDict = req.body;

    for (const [programId, programData] of Object.entries(nutritionDict)) {
      await NutritionProgram.findOneAndUpdate(
        { programId: programId },
        {
          title: programData.title,
          desc: programData.desc,
          meals: programData.meals,
        },
        { upsert: true, new: true },
      );
    }

    res.status(200).json({
      message: "All nutrition programs saved successfully to database!",
    });
  } catch (err) {
    console.error("Error saving bulk nutrition:", err);
    res.status(500).json({ error: err.message });
  }
};
