const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  specialty: String, 
}, { timestamps: true });

module.exports = mongoose.model('Chef', chefSchema);