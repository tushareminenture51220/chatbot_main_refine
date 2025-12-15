const fs = require("fs");
const path = require("path");
const TriggerResModel = require("../model/TriggersResSchema");
const DetailUserModel = require("../model/DetailUserSchema");
const MulTriggerResModel = require("../model/MultipleTriggerResSchema");

//get preview chatbot
const getPeviewPage = async (req, res) => {
  try {
    const jsFilePath = path.join("chatbot-preview", "index.js");
    const id = req.params.id;
    let jsContent = fs.readFileSync(jsFilePath, "utf8");
    jsContent = jsContent.replace(
      'let hashedId = "";',
      `let hashedId = "${id}";`
    );

    // Set response headers for JavaScript
    res.setHeader("Content-Type", "application/javascript");

    // Send the JavaScript content as the response
    res.status(200).send(jsContent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Error Occurred",
    });
  }
};

//get triggers and response for preview
const getUserTriggerResponse = async (req, res) => {
  try {
    const userId = req.params.id;
    const triggerResponse = await TriggerResModel.find({
      userId: userId,
    }).select("-__v");
    if (!triggerResponse) {
      return res.status(404).json({
        status: "error",
        message: "Trigger & Responses are not found",
      });
    } else {
      const MultipleResposes = await MulTriggerResModel.find({
        userId: userId,
      }).select("-__v");
      if (!MultipleResposes) {
        return res.status(404).json({
          status: "error",
          message: "Trigger & Responses are not found",
        });
      } else {
        return res.status(200).json({
          status: "success",
          data: [...triggerResponse, ...MultipleResposes],
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await DetailUserModel.findOne({ userId: id });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    return res.status(200).send({
      status: "success",
      user: {
        name: user.fullName,
        userImage: user.userImage,
        companyName: user.companyName,
        companySlogan: user.companySlogan,
        theme: user.theme,
      },
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Error Occured" });
  }
};

module.exports = {
  getPeviewPage,
  getUserTriggerResponse,
  getUser,
};
