const mongoose = require("mongoose");

const otpForMasterAdminAccLink = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    otp: {
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

const OtpForMasterAdminAccLinkModel = mongoose.model(
  "otpForMasterAdminAccLink",
  otpForMasterAdminAccLink
);

module.exports = OtpForMasterAdminAccLinkModel;
