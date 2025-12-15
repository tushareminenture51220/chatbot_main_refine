const mongoose = require("mongoose");

const chatMassageSchema = mongoose.Schema(
  {
    chatUsers: {
      type: Array,
      required: true,
      trim: true,
    },
    message: { type: String, trim: true, default: "loding.." },
    attachmentFile: { type: String },
    attachmentFileId: { type: String },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    type: { type: String, default: "bot" },
    assiMsgData: { type: Object },
    assiUnavailableFromData: { type: Object },
    customFormsData: { type: Object },
  },
  { timestamps: true }
);

const ChatMassageModel = mongoose.model("message", chatMassageSchema);

module.exports = ChatMassageModel;
