const nodemailer = require("nodemailer");
const MasterAdminAccountsModel = require("../model/MasterAdminAccountsSchema");
const UserModel = require("../model/UserSchema");
const DetailUserModel = require("../model/DetailUserSchema");
const OtpForMasterAdminAccLinkModel = require("../model/OTPforAccountsLinkedWithMasterAdminSchema");
const LiveChatUserModel = require("../model/LiveChatUserSchema");
const MasterAdminCommonAssistantModel = require("../model/MasterAdminCommonAssistantScheama");
const Cloudinary = require("../utils/cloudinary");

// Subfunction for email validation
const isEmailValid = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const linkedAccountwithMasterAdmin = async (req, res) => {
  try {
    const { accountEmail, supportEmail } = req.body;

    if (!isEmailValid(accountEmail)) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is not valid" });
    }

    const existingUser = await UserModel.findOne({ email: accountEmail });
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found with this email" });
    }

    const alreadyLinkedWithMasterAdmin = await MasterAdminAccountsModel.findOne(
      {
        accountEmail: accountEmail,
      }
    );

    if (alreadyLinkedWithMasterAdmin) {
      return res.status(400).json({
        status: "error",
        message: "This user already linked with Master Admin",
      });
    }

    // Check if OTP has already been sent to this user
    const existingOtpDoc = await OtpForMasterAdminAccLinkModel.findOne({
      email: accountEmail,
    });

    let otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP

    if (!existingOtpDoc) {
      let otpDataforAccLink = new OtpForMasterAdminAccLinkModel({
        email: accountEmail,
        otp: otp,
        expiresIn: new Date().getTime() + 300 * 1000, // 5 minutes expiry
      });
      await otpDataforAccLink.save();
    } else {
      existingOtpDoc.otp = otp;
      existingOtpDoc.expiresIn = new Date().getTime() + 300 * 1000; // 5 minutes expiry
      await existingOtpDoc.save(); // Updated OTP
    }

    // Sending OTP via email with template
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailDetails = {
      from: process.env.EMAIL_USER,
      to: accountEmail,
      cc: supportEmail,
      subject: "Account Linked OTP",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border: 1px solid #ddd;">
        <div style="text-align: center;">
          <h2 style="color: #4CAF50;">Account Link Verification</h2>
          <p style="font-size: 16px; color: #333;">Hi there,</p>
          <p style="font-size: 16px; color: #333;">You're receiving this email because we need to verify your account for linking with the Master Admin.</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ccc; display: inline-block; margin: 20px 0;">
            <p style="font-size: 18px; font-weight: bold; color: #333;">Your OTP Code:</p>
            <p style="font-size: 32px; font-weight: bold; color: #4CAF50;">${otp}</p>
          </div>
          <p style="font-size: 16px; color: #333;">Please use this code within the next 5 minutes to complete the account linking process.</p>
          <p style="font-size: 16px; color: #333;">If you did not request this action, you can safely ignore this email.</p>
          <br>
          <p style="font-size: 14px; color: #777;">Thank you!</p>
          <p style="font-size: 14px; color: #777;">The Master Admin Team</p>
        </div>
      </div>
      `,
    };

    // Use async/await for email sending
    try {
      await mailTransporter.sendMail(mailDetails);
      return res.status(200).json({
        status: "success",
        message: "OTP set successfully! Check your email for the code.",
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Error while sending mail",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const AddAccountsWithMasterAdmin = async (req, res) => {
  try {
    console.log(req.body);
    let data = await OtpForMasterAdminAccLinkModel.find({
      email: req.body.email,
      otp: req.body.otp,
    });
    // console.log("data", data);
    if (data.length > 0) {
      let currentTime = new Date().getTime();
      let diff = data[0].expiresIn - currentTime;
      if (diff < 0) {
        return res
          .status(401)
          .json({ status: "error", message: "OTP Expired!" });
      } else {
        const user = await UserModel.findOne({ email: req.body.email });
        //console.log("user", user);
        if (user) {
          const detailsUser = await DetailUserModel.findOne({
            userId: user._id,
          });
          if (detailsUser) {
            const account = await MasterAdminAccountsModel.create({
              masterAdminId: req.body.masterAdminId,
              companyName: detailsUser.companyName,
              accountEmail: user.email,
              accountId: user._id,
              companyWebsite: user.website,
              companyLogo: detailsUser.userImage,
            });
            await account.save();
            return res.status(200).json({
              status: "success",
              message: "User Register successfully",
            });
          } else {
            const account = await MasterAdminAccountsModel.create({
              masterAdminId: req.body.masterAdminId,
              companyName: user.email.split("@")[0],
              accountEmail: user.email,
              accountId: user._id,
              companyWebsite: user.website,
            });
            await account.save();
            return res.status(200).json({
              status: "success",
              message: "User Register successfully",
            });
          }
        }
      }
    } else {
      return res.status(401).json({ status: "error", message: "Invalid Otp!" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
    console.log(error);
  }
};

const getAddedAccountswithMasterAdmin = async (req, res) => {
  try {
    const masterAdminId = req.params.id;
    //console.log("masterAdminId", masterAdminId);
    const data = await MasterAdminAccountsModel.find({ masterAdminId });
    if (data) {
      return res.status(200).json({ status: "success", data: data });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Data not found!" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
    console.log(error);
  }
};

const deleteLinkedAccounts = async (req, res) => {
  try {
    // Extracting the values (IDs) from the request body object
    const linkedAccountsIds = Object.values(req.body);

    //Deleting multiple assistants based on the extracted IDs
    const result = await MasterAdminAccountsModel.deleteMany({
      _id: { $in: linkedAccountsIds },
    });

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: `${result.deletedCount} account unlinked successfully.`,
      });
    } else {
      res.status(404).json({
        message: "No accounts found with the provided IDs.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
    console.log(error);
  }
};

const getParticularAccountsUser = async (req, res) => {
  try {
    const linkedAccountsIds = Object.values(req.body);
    const usersData = await LiveChatUserModel.find({
      adminId: { $in: linkedAccountsIds },
    }).sort({
      updatedAt: -1,
    });
    res.status(200).json({
      status: "success",
      data: usersData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
    console.log(error);
  }
};

const createAssistantofMasterAdmin = async (req, res) => {
  try {
    const { userEmail, userName, status, masterAdminId } = req.body;

    const user = await MasterAdminCommonAssistantModel.findOne({
      userEmail,
      masterAdminId,
    });

    if (user) {
      return res
        .status(200)
        .send({ status: "error", message: "Assistant already Exists" });
    } else {
      let result;
      if (req.file) {
        result = await Cloudinary.uploader.upload(req.file.path);
      }
      const createUser = await MasterAdminCommonAssistantModel.create({
        userEmail,
        userName,
        status,
        pin: Math.floor(Math.random() * 900000) + 100000,
        masterAdminId,
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
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">Welcome to the Team, ${createUser?.userName}!</h2>
          <p style="font-size: 16px; color: #333;">Congratulations! You have successfully registered as a Chatbot Assistant under Master Admin.</p>
          <div style="border-top: 1px solid #eee; margin: 20px 0;"></div>
          <p style="font-size: 14px; color: #555;"><strong>Your Details:</strong></p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Email:</strong> ${createUser?.userEmail}</li>
            <li><strong>Name:</strong> ${createUser?.userName}</li>
            <li><strong>Secret Pin:</strong> <span style="color: #FF5722;">${createUser?.pin}</span></li>
          </ul>
          <div style="border-top: 1px solid #eee; margin: 20px 0;"></div>
          <p style="font-size: 14px; color: #333;">If you have any questions, feel free to reach out to us.</p>
          <p style="font-size: 14px; color: #333;">Thank you,<br>Chatbot Team</p>
          <div style="text-align: center; padding: 20px;">
            <a href="#" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 16px;">Go to Dashboard</a>
          </div>
          <div style="font-size: 12px; text-align: center; color: #999; margin-top: 20px;">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
        `,
      };

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          return res.status(400).json({
            status: "error",
            message: "Error while sending mail",
          });
        } else {
          return res.status(200).send({
            status: "success",
            message: "Assistant registered successfully",
          });
        }
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

const getMasterAdminAssistnats = async (req, res) => {
  try {
    const masterAdminId = req.params.id;

    const Assistant = await MasterAdminCommonAssistantModel.find({
      masterAdminId,
    });
    res.status(200).send({ status: "success", data: Assistant });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

module.exports = {
  linkedAccountwithMasterAdmin,
  AddAccountsWithMasterAdmin,
  getAddedAccountswithMasterAdmin,
  deleteLinkedAccounts,
  getParticularAccountsUser,
  createAssistantofMasterAdmin,
  getMasterAdminAssistnats,
};
