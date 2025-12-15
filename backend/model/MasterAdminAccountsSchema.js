const mongoose = require("mongoose");

const masterAdminAccountsSchema = mongoose.Schema(
  {
    masterAdminId: { type: mongoose.Schema.Types.ObjectId, required: true },
    companyName: { type: String },
    accountEmail: { type: String, required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, required: true },
    companyWebsite: { type: String, required: true },
    companyLogo: { type: String, trim: true, required: false },
  },
  { timestamps: true }
);

const MasterAdminAccountsModel = mongoose.model(
  "masterAdminAcoount",
  masterAdminAccountsSchema
);
module.exports = MasterAdminAccountsModel;
