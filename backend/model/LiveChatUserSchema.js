const mongoose = require("mongoose");

const liveChatUserSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    status: { type: Boolean, default: false },
    location: { type: Object },
    visitedPage: { type: String, default: "Homepage" },
    joinedExecutive: {
      type: Object,
      default: { status: false, executive: null },
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    deletedStatus: { type: Boolean, default: true },
    masterAdminDeletedStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const LiveChatUserModel = mongoose.model("liveChatUser", liveChatUserSchema);

module.exports = LiveChatUserModel;
