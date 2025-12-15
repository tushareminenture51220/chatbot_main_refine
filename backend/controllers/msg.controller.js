const ChatMassageModel = require("../model/ChatMassageSchema");
const Cloudinary = require("../utils/cloudinary");
const LiveChatUserModel = require("../model/LiveChatUserSchema");
const createMsg = async (req, res) => {
  try {
    const {
      from,
      to,
      message,
      type,
      assiMsgData,
      assiUnavailableFromData,
      customFormsData,
      responsesData,
    } = req.body;
    let result;

    if (req.file) {
      result = await Cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });
    }

    // Create the new message
    const newMessage = await ChatMassageModel.create({
      message: message,
      chatUsers: [from, to],
      sender: from,
      attachmentFile: result ? result.secure_url : "",
      attachmentFileId: result ? result.public_id : "",
      type: type,
      assiMsgData: assiMsgData ? JSON.parse(assiMsgData) : null,
      assiUnavailableFromData: assiUnavailableFromData || null,
      customFormsData: customFormsData || null,
      responsesData: responsesData || [],
    });

    if (newMessage) {
      // Fetch users involved in the chat
      const chatUsers = [from, to];

      // Update deletedStatus for users present in LiveChatUserModel
      const user = await LiveChatUserModel.updateMany(
        { _id: { $in: chatUsers } },
        { deletedStatus: true }
      );
      // console.log(user);
      // console.log(newMessage);
      return res.status(200).json({
        status: "success",
        message:
          "Message added successfully and users' deleted status updated.",
        newMessage,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to add message to the database",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

// const createMsg = async (req, res) => {
//   try {
//     const {
//       from,
//       to,
//       message,
//       type,
//       assiMsgData,
//       assiUnavailableFromData,
//       customFormsData,
//       responsesData,
//     } = req.body;
//     let result;
//     if (req.file) {
//       result = await Cloudinary.uploader.upload(req.file.path, {
//         resource_type: "auto",
//       });
//     }
//     const newMessage = await ChatMassageModel.create({
//       message: message,
//       chatUsers: [from, to],
//       sender: from,
//       attachmentFile: result ? result.secure_url : "",
//       attachmentFileId: result ? result.public_id : "",
//       type: type,
//       assiMsgData: assiMsgData ? JSON.parse(assiMsgData) : null,
//       assiUnavailableFromData: assiUnavailableFromData
//         ? assiUnavailableFromData
//         : null,
//       customFormsData: customFormsData ? customFormsData : null,
//       responsesData: responsesData ? responsesData : [],
//     });
//     console.log(newMessage, "newMessage");
//     if (newMessage) {
//       return res.status(200).json({
//         status: "success",
//         message: "message added successfully",
//         newMessage,
//       });
//     } else {
//       return res.status(400).json({
//         status: "error",
//         message: "failed to add message to the databse",
//       });
//     }
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json("Internal server error");
//   }
// };

const getChatMsg = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (from && to) {
      const newMsg = await ChatMassageModel.find({
        chatUsers: { $all: [from, to] },
      }).sort({ updatedAt: 1 });
      const projectMessages = newMsg.map((msg) => {
        return {
          myself: msg.sender.toString() == from,
          message: msg.message,
          attachmentFile: msg.attachmentFile,
          type: msg.type,
          assiMsgData: msg.assiMsgData ? msg.assiMsgData : null,
          assiUnavailableFromData: msg.assiUnavailableFromData
            ? msg.assiUnavailableFromData
            : null,
          customFormsData: msg.customFormsData ? msg.customFormsData : null,
          responsesData: msg.responsesData ? msg.responsesData : [],
        };
      });
      return res.status(200).json({ status: "success", projectMessages });
    } else if (from) {
      // console.log(from, "form");
      const newMsg = await ChatMassageModel.find({
        chatUsers: { $all: [from] },
      });
      const projectMessages = newMsg.map((msg) => {
        return {
          myself: msg.sender.toString() == from,
          message: msg.message,
          attachmentFile: msg.attachmentFile,
          type: msg.type,
          assiMsgData: msg.assiMsgData ? msg.assiMsgData : null,
          assiUnavailableFromData: msg.assiUnavailableFromData
            ? msg.assiUnavailableFromData
            : null,
          customFormsData: msg.customFormsData ? msg.customFormsData : null,
          responsesData: msg.responsesData ? msg.responsesData : [],
        };
      });
      return res.status(200).json({ status: "success", projectMessages });
    } else {
      const newMsg = await ChatMassageModel.find({
        chatUsers: { $all: [to] },
      });
      const projectMessages = newMsg.map((msg) => {
        return {
          myself: msg.sender.toString() !== to,
          message: msg.message,
          attachmentFile: msg.attachmentFile,
          type: msg.type,
          assiMsgData: msg.assiMsgData ? msg.assiMsgData : null,
          assiUnavailableFromData: msg.assiUnavailableFromData
            ? msg.assiUnavailableFromData
            : null,
          customFormsData: msg.customFormsData ? msg.customFormsData : null,
          responsesData: msg.responsesData ? msg.responsesData : [],
        };
      });
      return res.status(200).json({ status: "success", projectMessages });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

const deleteAllMessagesFunc = async (req, res) => {
  try {
    // Extract the senderId from the request parameters
    const senderId = req.params.id;

    // Find the user with the given senderId
    const user = await LiveChatUserModel.findOne({ _id: senderId });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if there are any messages with this senderId
    const existingMessages = await ChatMassageModel.find({
      chatUsers: { $in: [senderId] },
    });

    if (existingMessages.length > 0) {
      // Delete the messages
      const deletedMessages = await ChatMassageModel.deleteMany({
        chatUsers: { $in: [senderId] },
      });

      // Update the deletedStatus to false
      user.deletedStatus = false;
      await user.save();

      return res.status(200).json({
        status: "success",
        message:
          "User successfully removed from inbox along with their messages!",
      });
    } else {
      // If no messages found, just update the deletedStatus to false
      user.deletedStatus = false;
      await user.save();

      return res.status(200).json({
        status: "success",
        message:
          "User successfully removed from inbox along with their messages!",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json("Internal server error");
  }
};
const changeUserDeleteStatus = async (req, res) => {
  try {
    // Extract the userId and status from the request parameters
    const userId = req.params.id;
    const status = req.params.status === "true"; // Convert string 'true'/'false' to boolean

    // Find the user with the given userId
    const user = await LiveChatUserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Update the deletedStatus
    user.deletedStatus = status;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User status updated successfully!",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  createMsg,
  getChatMsg,
  deleteAllMessagesFunc,
  changeUserDeleteStatus,
};
