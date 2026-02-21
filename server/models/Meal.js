const mongoose = require('mongoose');
const mealSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  description: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  calories: Number,
  price: Number,
  image: { type: String, default: null } // حقل الصورة
}, { timestamps: true });
module.exports = mongoose.model('Meal', mealSchema);