const mongoose = require("mongoose");

const forgotPassOtp = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    code: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ForgotPassOtp = mongoose.model("otpforgotpassword", forgotPassOtp);

module.exports = ForgotPassOtp;
