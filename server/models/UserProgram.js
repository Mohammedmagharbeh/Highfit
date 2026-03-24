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

const userProgramSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

    status: {
      type: String,
      enum: ["waiting", "submitted", "approved", "rejected"],
      default: "waiting",
    },
    rejectionReason: { type: String, default: "" },
    coachNote: { type: String, default: "" },

    trainingPlan: {
      title: { type: String, default: "برنامج التدريب" },
      arabicTitle: { type: String, default: "برنامج التدريب" },
      desc: { type: String, default: "" },
      training: [trainingDaySchema],
    },

    nutritionPlan: {
      title: { type: String, default: "برنامج التغذية" },
      desc: { type: String, default: "" },
      meals: [nutritionMealSchema],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserProgram", userProgramSchema);
