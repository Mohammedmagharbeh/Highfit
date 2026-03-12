const express = require("express");
const router = express.Router();
const validateJWT = require("../middleware/validateJWT");
const notificationController = require("../controller/notificationController");

router.get("/", validateJWT, notificationController.getNotifications);
router.put("/:id/read", validateJWT, notificationController.markAsRead);
router.put("/read-all", validateJWT, notificationController.markAllAsRead);

module.exports = router;
