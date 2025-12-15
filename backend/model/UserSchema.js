const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    termsAndConditions: { type: Boolean, required: true, default: true },
    pin: { type: Number, require: true },
    theme: {
      type: String,
      default:
        "linear-gradient(135deg, rgb(41, 50, 60) 0%, rgb(72, 85, 99) 100%)",
    },
  },
  { timestamps: true }
);

const UserSchema = mongoose.model("user", userSchema);

module.exports = UserSchema;
