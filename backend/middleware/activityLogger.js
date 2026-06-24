const Admin = require("../models/Admin");

const logAdminActivity = async (adminId, action, details) => {
  try {
    if (!adminId) return;
    await Admin.findByIdAndUpdate(adminId, {
      $push: {
        activityLogs: {
          action,
          details,
          timestamp: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Failed to log admin activity:", error.message);
  }
};

module.exports = { logAdminActivity };
