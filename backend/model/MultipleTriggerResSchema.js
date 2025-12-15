const mongoose = require("mongoose");

const urlData = new mongoose.Schema({
  label: String,
  link: String,
});

const multipleResponsesScheam = new mongoose.Schema({
  responseMsg: String,
  title: String,
  attachmentFile: String,
  attachmentFileId: String,
  suggestedTrigger: [String],
  urlLabels: [urlData],
});
const multipleResponseMain = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    triggerText: {
      type: [String],
      required: true,
      trim: true,
    },
    commonData: {
      type: Boolean,
      default: false,
    },
    initialResponse: {
      type: String,
      default: false,
    },
    format: { type: String, default: "slider" },
    multipleRes: { type: Boolean, default: true },
    responsesData: [multipleResponsesScheam],
  },
  { timestamps: true }
);

const MulTriggerResModel = mongoose.model(
  "multiple_trigger_response",
  multipleResponseMain
);

module.exports = MulTriggerResModel;
