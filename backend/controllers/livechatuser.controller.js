const mongoose = require("mongoose");
const LiveChatUserModel = require("../model/LiveChatUserSchema");
const OverAllPerformaceModel = require("../model/OverAllPerformanceSchema");
const nodemailer = require("nodemailer");
const createUser = async (req, res) => {
  try {
    const { userEmail, userName, location, visitedPage, status } = req.body;
    const adminId = req.params.id;

    // Check if the user already exists under the same adminId
    const existingUser = await LiveChatUserModel.findOne({
      userEmail,
      adminId,
    });

    if (existingUser) {
      // Update existing user's details
      existingUser.location = location;
      existingUser.visitedPage = visitedPage;
      existingUser.updatedAt = new Date();
      existingUser.status = true;

      await existingUser.save();

      // Update performance data
      const performanceData = await OverAllPerformaceModel.findOne({
        _id: "658538fc59803311c99355fe",
      });

      if (performanceData) {
        performanceData.Total_Chatbot_Sessions += 1;
        performanceData.Total_Users_Queries = Math.floor(
          (performanceData.Total_Chatbot_Sessions / 100) * 80
        );
        performanceData.First_Contact_Resolution = Math.floor(
          0.8 * performanceData.Total_Users_Queries
        );

        await performanceData.save();
      }

      return res.status(200).send({
        status: "success",
        message: "User updated successfully",
        user: existingUser,
      });
    } else {
      // Create a new user
      const newUser = new LiveChatUserModel({
        userEmail,
        userName,
        location,
        visitedPage,
        status: true,
        adminId,
      });

      await newUser.save();

      // Update performance data
      const performanceData = await OverAllPerformaceModel.findOne({
        _id: "658538fc59803311c99355fe",
      });

      if (performanceData) {
        performanceData.Total_Unique_Users += 1;
        performanceData.Total_Chatbot_Sessions += 1;
        performanceData.Total_Users_Queries = Math.floor(
          (performanceData.Total_Chatbot_Sessions / 100) * 80
        );
        performanceData.First_Contact_Resolution = Math.floor(
          0.8 * performanceData.Total_Users_Queries
        );

        await performanceData.save();
      }

      return res.status(200).send({
        status: "success",
        message: "User registered successfully",
        user: newUser,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal server error");
  }
};

//getting users
const getUsers = async (req, res) => {
  try {
    const adminId = req.params.id;
    const users = await LiveChatUserModel.find({ adminId }).sort({
      updatedAt: -1,
    });
    res.status(200).send({ status: "success", data: users });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

//get particular user
const getParticularUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await LiveChatUserModel.findOne({ _id });

    res.status(200).send({
      status: "success",
      data: {
        userEmail: user.userEmail,
        _id: user._id,
        joinedExecutive: user.joinedExecutive,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

const chatTranscriptSendToMail = async (req, res) => {
  try {
    const { chatMessages, userEmail, companyName, website, clientEMail } =
      req.body;

    if (!chatMessages || !userEmail) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: chatMessages or userEmail.",
      });
    }

    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let currentDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    let mailDetails = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `${
        companyName ? companyName : "EMBOT"
      } Chatbot Chat Transcript: Conversation Summary - ${currentDate}`,
      html: "",
    };

    let chatDataHtml = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header-container {
            text-align: center;
            margin-bottom: 20px;
          }
          .company-name {
            color: #0056b3;
            font-size: 24px;
            font-weight: bold;
          }
          .chat-header {
            color: #0056b3;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .chat-date {
            font-size: 14px;
            color: #666;
          }
          .chat-message {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
          }
          .chat-message:nth-child(odd) {
            background-color: #f1f1f1;
          }
          .chat-attachment {
            color: #007bff;
            text-decoration: none;
          }
          .chat-attachment img {
            max-width: 100%;
            height: auto;
          }
          .chat-separator {
            border: 0;
            border-top: 1px solid #ddd;
            margin: 20px 0;
          }
          .form-data {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            background-color: #fff;
          }
          .form-data h3 {
            margin-top: 0;
            font-size: 16px;
            font-weight: bold;
          }
          .form-data p {
            margin: 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          
          <h2 class="chat-header">Chat Transcript</h2>
          <p class="chat-date"><strong>Date:</strong> ${currentDate}</p>
          <div class="company-name">${
            companyName ? companyName : "EMChatBot"
          }</div>
          <p><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></p>
        </div>
        <hr class="chat-separator"/>
    `;

    chatMessages.forEach((elem) => {
      const {
        myself,
        message,
        attachmentFile,
        type,
        assiMsgData,
        assiUnavailableFromData,
        customFormsData,
      } = elem;
      const sender = myself
        ? "You"
        : assiMsgData?.userName
        ? assiMsgData?.userName
        : "EMChatBot";
      let messageLine = "";

      if (message) {
        messageLine += `<div class="chat-message"><strong>${sender}:</strong> ${message}</div>`;
      }

      if (assiUnavailableFromData) {
        messageLine += `
         <div class="form-data">
            <strong>Assistance Unavailable Info:</strong><br>
            <h3>Email</h3>
            <p>${assiUnavailableFromData.email}</p>
            <hr class="w-full border-t border-gray-300 mb-2"/>
            <h3>Phone</h3>
            <p>$${assiUnavailableFromData.phone}</p>
            <hr class="w-full border-t border-gray-300 mb-2"/>
            <h3>Message</h3>
            <p>${assiUnavailableFromData.message}</p>
            <hr class="w-full border-t border-gray-300 mb-2"/>
          </div>
        `;
      }

      if (customFormsData) {
        messageLine += '<div class="form-data">';
        Object.entries(customFormsData).forEach(([key, value]) => {
          if (key !== "Long Text") {
            messageLine += `
              <h3>${key}</h3>
              <p>${value}</p>
              <hr class="w-full border-t border-gray-300 mb-2"/>
            `;
          } else {
            messageLine += `<p>${value}</p>`;
          }
        });
        messageLine += "</div>";
      }

      if (attachmentFile) {
        if (type === "image") {
          messageLine += `<div class="chat-message"><strong>Attachment:</strong> <img src="${attachmentFile}" alt="Attachment" /></div>`;
        } else {
          messageLine += `<p class="chat-message"><strong>Attachment:</strong> <a href="${attachmentFile}" class="chat-attachment" target="_blank">${attachmentFile}</a></p>`;
        }
      }

      if (messageLine) {
        chatDataHtml += messageLine;
        chatDataHtml += '<hr class="chat-separator"/>';
      }
    });

    chatDataHtml += "</body></html>";
    mailDetails.html = chatDataHtml;

    mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        console.log("Error sending mail:", err);
        return res.status(400).json({
          status: "error",
          message: "Error while sending chat transcript mail",
        });
      } else {
        console.log("Chat Transcript Sent Successfully!!");
        return res.status(200).json({
          status: "success",
          message: "Chat Transcript Sent Successfully!!",
        });
      }
    });
  } catch (e) {
    console.log("Exception:", e);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request.",
    });
  }
};

// const resetJoinedExecutiveStatus = async (req, res) => {
//   try {
//     const { assistantId } = req.params;

//     // Convert to ObjectId
//     const objectIdAssistantId = new mongoose.Types.ObjectId(assistantId);

//     // Find users where joinedExecutive.executive._id matches the given ID
//     const result = await LiveChatUserModel.find({
//       "joinedExecutive.executive._id": objectIdAssistantId,
//     });
//     return res.status(200).json({
//       success: true,
//       message: "Updated joinedExecutive status for all applicable users.",
//       modifiedCount: result,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error updating joinedExecutive status.",
//       error: error.message,
//     });
//   }
// };
const resetJoinedExecutiveStatus = async (req, res) => {
  try {
    const { assistantId } = req.params;

    // Convert assistantId to ObjectId
    const objectIdAssistantId = new mongoose.Types.ObjectId(assistantId);

    // Update users where joinedExecutive.executive._id matches assistantId
    const result = await LiveChatUserModel.updateMany(
      { "joinedExecutive.executive._id": objectIdAssistantId },
      {
        $set: {
          "joinedExecutive.status": false,
          "joinedExecutive.executive": null,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Updated joinedExecutive status for all applicable users.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating joinedExecutive status.",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getParticularUser,
  chatTranscriptSendToMail,
  resetJoinedExecutiveStatus,
};
