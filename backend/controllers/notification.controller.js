const NotificationModel = require("../model/NotificationSchema");

const addNotification = async (req, res) => {
  try {
    const createNotification = await NotificationModel.create(req.body);
    if (createNotification) {
      return res.status(200).send({
        status: "success",
        message: "Notification Added successfully!",
      });
    } else {
      return res
        .status(400)
        .send({ status: "error", message: "failled to add Notification!" });
    }
  } catch (e) {
    return res.status(500).json("Internal server error");
  }
};

//getNotifications for particular admins
const getNotifications = async (req, res) => {
  try {
    const adminId = req.params.id;
    const notifications = await NotificationModel.find({
      adminId,
    });
    return res.status(200).send({ status: "success", data: notifications });
  } catch (e) {
    return res.status(500).json("Internal server error");
  }
};

//update Notification Status
const updateNotificationStatus = async (req, res) => {
  try {
    const _id = req.params.id;
    const updateNotificationStatus = await NotificationModel.findOne({ _id });
    updateNotificationStatus.seenStatus = true;
    updateNotificationStatus.save();
    return res.status(200).send({
      status: "success",
      message: "Notification Updated successfully!",
    });
  } catch (e) {
    return res.status(500).json("Internal server error");
  }
};

// get notificationf or master admin
const getNotificationsMA = async (req, res) => {
  try {
    const adminId = Object.values(req.body);
    const notifications = await NotificationModel.find({
      adminId: { $in: adminId },
    });
    return res.status(200).send({ status: "success", data: notifications });
  } catch (e) {
    return res.status(500).json("Internal server error");
  }
};

module.exports = {
  addNotification,
  getNotifications,
  updateNotificationStatus,
  getNotificationsMA,
};
