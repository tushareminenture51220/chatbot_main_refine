const MasterAdminUserModel = require("../model/MasterAdminUserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OtpForgotPassSchema = require("../model/OtpForgotPassSchema");
const { sendOtpMail } = require("../utils/mail");
const isEmailValid = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const createMasterAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // Check if the user already exists
    const existingUser = await MasterAdminUserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Create new user

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new MasterAdminUserModel({
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const loginMasterAdminUser = async (req, res) => {
  const { email, password } = req.body;
  if (!isEmailValid(email)) {
    if (email.length == 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Email is not valid" });
    }
  } else if (!password) {
    return res
      .status(400)
      .json({ status: "error", message: "password is required" });
  }
  try {
    const existingUser = await MasterAdminUserModel.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "2d" }
    );

    return res.status(201).json({
      status: "success",
      message: "You have successfully logged in",
      user: {
        email: existingUser.email,
      },
      token,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Error Occured" });
  }
};



const forgotPasswordMasterAdmin = async (req, res) => {
  const { email } = req.body;
  console.log("email", email)

  // 1. Validate email
  if (!email || !isEmailValid(email)) {
    return res.status(400).json({
      status: "error",
      message: !email ? "Email is required" : "Invalid email",
    });
  }

  try {
    // 2. Check master admin existence
    const adminUser = await MasterAdminUserModel.findOne({ email });
    if (!adminUser) {
      // ⚠️ Ideally return generic message to avoid enumeration
      return res.status(404).json({
        status: "error",
        message: "Admin user not found",
      });
    }

    // 3. Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiresIn = Date.now() + 5 * 60 * 1000; // 5 minutes

    // 4. Upsert OTP
    await OtpForgotPassSchema.findOneAndUpdate(
      { email },
      { code: otp, expiresIn },
      { upsert: true, new: true }
    );

    // 5. Send OTP email
    await sendOtpMail(email, otp);

    return res.status(200).json({
      status: "success",
      message: "OTP sent to registered email",
    });

  } catch (error) {
    console.error("Master Admin Forgot Password Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const masterOtpVerify = async (req, res) => {
  const { email, otp } = req.body;

  // 1️⃣ Basic validation
  if (!email || !otp) {
    return res.status(400).json({
      status: "error",
      message: "Email and OTP are required",
    });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email",
    });
  }

  try {
    // 2️⃣ Check master admin existence
    const adminUser = await MasterAdminUserModel.findOne({ email });
    if (!adminUser) {
      return res.status(404).json({
        status: "error",
        message: "Admin user not found",
      });
    }

    // 3️⃣ Check OTP record existence
    const otpRecord = await OtpForgotPassSchema.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({
        status: "error",
        message: "OTP not found or already used",
      });
    }

    // 4️⃣ Check OTP expiry
    if (otpRecord.expiresIn < Date.now()) {
      await OtpForgotPassSchema.deleteOne({ email });

      return res.status(400).json({
        status: "error",
        message: "OTP expired",
      });
    }

    // 5️⃣ Match OTP
    console.log("otp", Number(otpRecord.code), Number(otp))
    if (Number(otpRecord.code) !== Number(otp)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }

    // 6️⃣ OTP verified → remove it
    await OtpForgotPassSchema.deleteOne({ email });

    return res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("Master OTP Verify Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const masterChangePassword = async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and new password are required",
    });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    // 2️⃣ Check master admin existence
    const adminUser = await MasterAdminUserModel.findOne({ email });
    if (!adminUser) {
      return res.status(404).json({
        status: "error",
        message: "Admin user not found",
      });
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Update password
    await MasterAdminUserModel.updateOne(
      { email },
      { password: hashedPassword }
    );

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Master Change Password Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


module.exports = {
  createMasterAdminUser,
  loginMasterAdminUser,
  forgotPasswordMasterAdmin,
  masterOtpVerify,
  masterChangePassword,
};
