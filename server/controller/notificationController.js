const Notification = require("../models/Notification");

// Get notifications for the current user (based on userId and role)
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    const notifications = await Notification.find({
      $or: [{ targetUserId: userId }, { targetRole: role }],
    })
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a specific notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark all notifications as read for current user
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    await Notification.updateMany(
      {
        $or: [{ targetUserId: userId }, { targetRole: role }],
        isRead: false,
      },
      { isRead: true }
    );
    
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
