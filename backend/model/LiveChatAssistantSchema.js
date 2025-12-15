const mongoose = require("mongoose");

const liveChatAssistantSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    joinedWith: { type: Object, default: { status: false, user: null } },
    status: { type: String, default: "Offline" },
    pin: { type: Number, require: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    assistantImage: {
      type: String,
    },
    assistantImageId: {
      type: String,
    },
  },
  { timestamps: true }
);

const LiveChatAssistantModel = mongoose.model(
  "liveChatAssistant",
  liveChatAssistantSchema
);

module.exports = LiveChatAssistantModel;
