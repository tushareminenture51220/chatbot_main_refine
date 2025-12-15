const mongoose = require("mongoose");

const masterAdminUserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const MasterAdminUserModel = mongoose.model(
  "masterAdminUser",
  masterAdminUserSchema
);

module.exports = MasterAdminUserModel;
