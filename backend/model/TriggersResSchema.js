const mongoose = require("mongoose");

const urlData = new mongoose.Schema({
  label: String,
  link: String,
});

const triggersResSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    multipleRes: { type: Boolean, default: false },
    triggerText: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      required: true,
      trim: true,
    },
    responseMsg: {
      type: String,
      trim: true,
    },
    attachmentFile: {
      type: String,
    },
    attachmentFileId: {
      type: String,
    },
    title: { type: String },

    suggestedTrigger: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      default: [],
      trim: true,
    },
    urlLabels: [urlData],

    commonData: {
      type: Boolean,
      default: false,
    },
    initialResponse: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

const TriggerResModel = mongoose.model("trigger_response", triggersResSchema);

module.exports = TriggerResModel;
