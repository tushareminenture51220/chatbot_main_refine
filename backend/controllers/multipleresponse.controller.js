const { default: mongoose } = require("mongoose");
const MulTriggerResModel = require("../model/MultipleTriggerResSchema");
const Cloudinary = require("../utils/cloudinary");

const createMultipleResponses = async (req, res) => {
  try {
    let {
      responseMsg,
      triggerText,
      suggestedTrigger,
      commonData,
      initialResponse,
      urlLabels,
      format,
      multipleResponseDraftId,
      title,
    } = req.body;
    const userId = req.userId;
    let mRDI = new mongoose.Types.ObjectId().toString();
    if (multipleResponseDraftId) {
      mRDI = multipleResponseDraftId;
    }
   // console.log(multipleResponseDraftId);
    if (triggerText) {
      triggerText = JSON.parse(triggerText);
    }
    if (suggestedTrigger) {
      suggestedTrigger = JSON.parse(suggestedTrigger);
    }
    if (urlLabels) {
      urlLabels = JSON.parse(urlLabels);
    }

    if (!responseMsg) {
      return res
        .status(401)
        .json({ status: "error", message: "response is required" });
    }

    let result;
    if (req.file) {
      result = await Cloudinary.uploader.upload(req.file.path);
    }

    // Find existing document based on userId
    const existingDocument = await MulTriggerResModel.findOne({
      _id: mRDI,
    });
    if (existingDocument) {
      // If document exists, update the responsesData array by adding new data
      existingDocument.responsesData.push({
        responseMsg,
        urlLabels,
        suggestedTrigger,
        attachmentFile: result ? result.secure_url : "",
        attachmentFileId: result ? result.public_id : "",
        title,
      });
      await existingDocument.save();
      return res.status(201).json({
        status: "success",
        message: "Trigger & Response created successfully",
        _id: existingDocument?._id,
      });
    } else {
      // If document doesn't exist, create a new document
      const dataCreateed = {
        userId,
        triggerText,
        initialResponse,
        format,
        multipleRes: true,
        responsesData: [
          {
            responseMsg,
            urlLabels,
            suggestedTrigger,
            attachmentFile: result ? result.secure_url : "",
            attachmentFileId: result ? result.public_id : "",
            title,
          },
        ],
      };
      const newDocument = new MulTriggerResModel(dataCreateed);
      await newDocument.save();
      return res.status(201).json({
        status: "success",
        message: "Trigger & Response created successfully",
        _id: newDocument?._id,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const getMultipleResParticularDocument = async (req, res) => {
  try {
    const _id = req.params.id;
    // Find the document based on userId
    const document = await MulTriggerResModel.findOne({ _id: _id });

    if (document) {
      res.status(200).json({ status: "success", data: document });
    } else {
      res.status(404).json({ status: "error", message: "Document not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

module.exports = { createMultipleResponses, getMultipleResParticularDocument };
