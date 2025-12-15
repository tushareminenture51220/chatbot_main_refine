const mongoose = require("mongoose");

const detailUserSchema = mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    companyName: { type: String, trim: true },
    companySlogan: { type: String, trim: true },
    userImage: { type: String, trim: true },
    userImageId: { type: String, trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    region: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    agreedToTerms: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DetailUserModel = mongoose.model("userdetails", detailUserSchema);

module.exports = DetailUserModel;
