const mongoose = require("mongoose");

const nutritionOptionSchema = new mongoose.Schema({
  desc: { type: String, default: "" },
  c: { type: Number, default: 0 },
  p: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  f: { type: Number, default: 0 },
});

const nutritionMealSchema = new mongoose.Schema({
  type: { type: String, required: true },
  calories: { type: String, default: "" },
  options: [nutritionOptionSchema],
});

const nutritionProgramSchema = new mongoose.Schema(
  {
    programId: { type: String, required: true, unique: true },
    title: { type: String, default: "برنامج التخسيس 1500 - 1900 سعرة" },
    desc: {
      type: String,
      default:
        "خيارات متعددة لوجبات متوازنة يومياً. قم باختيار وجبة واحدة من كل قسم للحفاظ على سعراتك.",
    },
    meals: [nutritionMealSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("NutritionProgram", nutritionProgramSchema);
