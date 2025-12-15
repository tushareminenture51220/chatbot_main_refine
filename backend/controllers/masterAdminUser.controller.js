const MasterAdminUserModel = require("../model/MasterAdminUserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

module.exports = {
  createMasterAdminUser,
  loginMasterAdminUser,
};
