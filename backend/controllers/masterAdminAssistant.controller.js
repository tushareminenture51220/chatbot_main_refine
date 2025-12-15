const MasterAdminCommonAssistantModel = require("../model/MasterAdminCommonAssistantScheama");
const LiveChatUserModel = require("../model/LiveChatUserSchema");
const OverAllPerformaceModel = require("../model/OverAllPerformanceSchema");
const ChatMassageModel = require("../model/ChatMassageSchema");

//check assistant
const checkAssistantMA = async (req, res) => {
  try {
    const { email, pin } = req.body;
    const userIdMA = req.params.id;

    const user = await MasterAdminCommonAssistantModel.findOne({
      userEmail: email,
      masterAdminId: userIdMA,
    });
    if (user) {
      const performanceData = await OverAllPerformaceModel.findOne({
        _id: "658538fc59803311c99355fe",
      });
      const keyword = "Queries_Resolution_LiveChat";
      if (performanceData && req.body.status == "Busy") {
        performanceData[keyword] += 1;
        performanceData.save();
      }
      if (req.body.status == "Busy") {
        if (user.pin != pin) {
          return res
            .status(400)
            .send({ status: "error", message: "Incorrect pin!" });
        } else {
          user.status = req.body.status;
          user.joinedWith = req.body.joinedWith;
          user.save();
          if (user) {
            const joinedWithUser = await LiveChatUserModel.findOne({
              _id: user.joinedWith.user._id,
            });
            const data = {
              status: true,
              executive: {
                userName: user.userName,
                userEmail: user.userEmail,
                _id: user._id,
                assistantImage: user.assistantImage,
              },
            };
            joinedWithUser.joinedExecutive = data;
            joinedWithUser.save();
          }
          res.status(200).json({
            status: "success",
            message: "Assistant Authenticated successfully",
            data: user,
          });
        }
      } else if (req.body.status == "Online") {
        if (user.status == "Busy") {
          const userId = user.joinedWith.user._id;
          user.status = req.body.status;
          user.joinedWith = { status: false, user: null };
          user.save();

          if (user) {
            const joinedWithUser = await LiveChatUserModel.findOne({
              _id: userId,
            });
            const data = {
              status: false,
              executive: null,
            };
            joinedWithUser.joinedExecutive = data;
            joinedWithUser.save();
          }
          res.status(200).json({
            status: "success",
            message: "Chat Logout successfully",
          });
        } else if (user.status == "Offline") {
          user.status = req.body.status;
          user.save();
          res.status(200).json({
            status: "success",
            message: `${user.userName} is Online!`,
          });
        }
      } else if (req.body.status == "Offline") {
        user.status = req.body.status;
        user.save();
        res.status(200).json({
          status: "success",
          message: `${user.userName} is Offline!`,
        });
      }
    } else {
      res.status(400).json({ status: "error", message: "Assistant Not Found" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

//assistant suggestions
const getAssistantSuggestionsMA = async (req, res) => {
  try {
    let value = req.params.value;
    let userId = req.params.userId;

    const data = await MasterAdminCommonAssistantModel.find({
      userEmail: { $regex: new RegExp(value, "i") },
      masterAdminId: userId,
    });

    // Check if data is found
    if (data) {
      return res.status(200).json({
        status: "success",
        data,
      });
    } else {
      return res.status(404).json({
        status: "not found",
        message: "No data found for the provided email.",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteMultipleAssistantsMA = async (req, res) => {
  try {
    // Extracting the values (IDs) from the request body object
    const assistantIds = Object.values(req.body);

    //Deleting multiple assistants based on the extracted IDs
    const result = await MasterAdminCommonAssistantModel.deleteMany({
      _id: { $in: assistantIds },
    });

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: `${result.deletedCount} assistants deleted successfully.`,
      });
    } else {
      res.status(404).json({
        message: "No assistants found with the provided IDs.",
      });
    }
  } catch (error) {
    console.error("Error deleting assistants:", error);
    res.status(500).json({
      message: "An error occurred while deleting assistants.",
      error: error.message,
    });
  }
};

// const deleteAllMessagesFuncMA = async (req, res) => {
//   try {
//     // Extract the senderId from the request parameters
//     const senderId = req.params.id;

//     // Find the user with the given senderId
//     const user = await LiveChatUserModel.findOne({ _id: senderId });

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     // Check if there are any messages with this senderId
//     const existingMessages = await ChatMassageModel.find({
//       chatUsers: { $in: [senderId] },
//     });

//     if (existingMessages.length > 0) {
//       // Delete the messages
//       const deletedMessages = await ChatMassageModel.deleteMany({
//         chatUsers: { $in: [senderId] },
//       });

//       // Update the deletedStatus to false
//       user.masterAdminDeletedStatus = false;
//       await user.save();

//       return res.status(200).json({
//         status: "success",
//         message:
//           "User successfully removed from inbox along with their messages!",
//       });
//     } else {
//       // If no messages found, just update the deletedStatus to false
//       user.masterAdminDeletedStatus = false;
//       await user.save();

//       return res.status(200).json({
//         status: "success",
//         message:
//           "User successfully removed from inbox along with their messages!",
//       });
//     }
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json("Internal server error");
//   }
// };
module.exports = {
  checkAssistantMA,
  getAssistantSuggestionsMA,
  deleteMultipleAssistantsMA,
};
