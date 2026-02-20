const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, default: 3 },
  reps: { type: String, default: "10 عدات" },
  desc: { type: String, default: "" },
  video: { type: String, default: "" },
  images: [{ type: String }],
});

const trainingDaySchema = new mongoose.Schema({
  day: { type: String, required: true },
  focus: { type: String, default: "" },
  cardio: { type: String, default: "" },
  exercises: [exerciseSchema],
});

const fitnessPlanSchema = new mongoose.Schema(
  {
    // The unique identifier matching the frontend keys ('beginner', 'advanced', 'expert')
    planId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    arabicTitle: { type: String, required: true },
    desc: { type: String, default: "" },
    color: { type: String, default: "" },
    iconName: { type: String, default: "" },
    training: [trainingDaySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("FitnessPlan", fitnessPlanSchema);
