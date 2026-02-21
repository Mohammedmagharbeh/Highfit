
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  mealName: { type: String, required: true },
  
  quantity: { 
    type: Number, 
    default: 1, 
    required: true 
  },
  notes: { 
    type: String, 
    default: "" 
  },
  
  status: { 
    type: String, 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);  