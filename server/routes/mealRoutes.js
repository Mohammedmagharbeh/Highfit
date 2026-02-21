const express = require('express');
const router = express.Router();
const mealCtrl = require('../controller/mealController');
const validateJWT = require('../middleware/validateJWT');

router.get('/', mealCtrl.getMeals);

router.post('/', validateJWT, mealCtrl.addMeal);
router.put('/:id', validateJWT, mealCtrl.updateMeal);
router.delete('/:id', validateJWT, mealCtrl.deleteMeal);

module.exports = router;