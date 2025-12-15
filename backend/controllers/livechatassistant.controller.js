const LiveChatAssistantModel = require("../model/LiveChatAssistantSchema");
const LiveChatUserModel = require("../model/LiveChatUserSchema");
const UserModel = require("../model/UserSchema");
const nodemailer = require("nodemailer");
const OverAllPerformaceModel = require("../model/OverAllPerformanceSchema");
const Cloudinary = require("../utils/cloudinary");

//users
const createAssistnats = async (req, res) => {
  try {
    const { userEmail, userName, status, userId, adminPin } = req.body;
    // const adminId = req.params.id;

    const isAdmin = await UserModel.findOne({ _id: userId });

    if (isAdmin.pin == adminPin) {
      const user = await LiveChatAssistantModel.findOne({ userEmail, userId });
      if (user) {
        return res
          .status(200)
          .send({ status: "error", message: "Assistant already Exists" });
      } else {
        let result;
        if (req.file) {
          result = await Cloudinary.uploader.upload(req.file.path);
        }
        const createUser = await LiveChatAssistantModel.create({
          userEmail,
          userName,
          status,
          pin: Math.floor(Math.random() * 900000) + 100000,
          userId,
          assistantImage: result ? result.secure_url : "",
          assistantImageId: result ? result.public_id : "",
        });
        createUser.save();
        //email send
        let mailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        let mailDetails = {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: "Chatbot Assistant Registration Confirmed 🎉",
          text: `Email : ${createUser?.userEmail} \n Name : ${createUser?.userName} \n Secrete Pin : ${createUser?.pin}`,
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
          if (err) {
            return res.status(400).json({
              status: "error",
              message: "error while sending mail",
            });
          } else {
            return res.status(200).send({
              status: "success",
              message: "Assistant registered successfully",
            });
          }
        });
      }
    } else {
      res.status(404).json({ status: "error", message: "Incorrect Pin!" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

//getting assistants
const getAssistnats = async (req, res) => {
  try {
    const userId = req.params.id;
    const Assistant = await LiveChatAssistantModel.find({ userId });
    res.status(200).send({ status: "success", data: Assistant });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

//check assistant
const checkAssistant = async (req, res) => {
  try {
    const { email, pin } = req.body;
    const userId = req.params.id;

    const user = await LiveChatAssistantModel.findOne({
      userEmail: email,
      userId: userId,
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
const getAssistantSuggestions = async (req, res) => {
  try {
    let value = req.params.value;
    let userId = req.params.userId;

    const data = await LiveChatAssistantModel.find({
      userEmail: { $regex: new RegExp(value, "i") },
      userId,
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

const deleteMultipleAssistants = async (req, res) => {
  try {
    // Extracting the values (IDs) from the request body object
    const assistantIds = Object.values(req.body);

    //Deleting multiple assistants based on the extracted IDs
    const result = await LiveChatAssistantModel.deleteMany({
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

module.exports = {
  createAssistnats,
  getAssistnats,
  checkAssistant,
  getAssistantSuggestions,
  deleteMultipleAssistants,
};
