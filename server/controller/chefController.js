const Meal = require('../models/Meal');
const Order = require('../models/Order');

// إضافة وجبة (للشيف)
exports.addMeal = async (req, res) => {
  const meal = await Meal.create(req.body);
  res.status(201).json(meal);
};

exports.getMeals = async (req, res) => {
  const meals = await Meal.find();
  res.json(meals);
};

exports.placeOrder = async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};