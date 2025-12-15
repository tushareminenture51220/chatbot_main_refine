const TriggerResModel = require("../model/TriggersResSchema");
const MulTriggerResModel = require("../model/MultipleTriggerResSchema");

const Cloudinary = require("../utils/cloudinary");

//here we save all triggers and response to database for particular users
const createData = async (req, res) => {
  try {
    let {
      responseMsg,
      triggerText,
      suggestedTrigger,
      commonData,
      initialResponse,
      urlLabels,
    } = req.body;
    const userId = req.userId;
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
    if (!triggerText) {
      return res
        .status(401)
        .json({ status: "error", message: "Trigger is required" });
    }

    let result;
    if (req.file) {
      result = await Cloudinary.uploader.upload(req.file.path);
    }

    const TRData = new TriggerResModel({
      responseMsg,
      triggerText,
      suggestedTrigger,
      userId,
      commonData,
      initialResponse,
      urlLabels,
      attachmentFile: result ? result.secure_url : "",
      attachmentFileId: result ? result.public_id : "",
      multipleRes: false,
    });

    await TRData.save();

    return res.status(201).json({
      status: "success",
      message: "Trigger & Response save successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

// Get a Trigger Responses by particular user => by ID
const getUserTriggerResponse = async (req, res) => {
  try {
    const userId = req.userId;
    const triggerResponse = await TriggerResModel.find({
      userId: userId,
    }).select("-__v");
    if (!triggerResponse) {
      return res.status(404).json({
        status: "error",
        message: "Trigger & Responses are not found",
      });
    } else {
      const MultipleResposes = await MulTriggerResModel.find({
        userId: userId,
      }).select("-__v");
      if (!MultipleResposes) {
        return res.status(404).json({
          status: "error",
          message: "Trigger & Responses are not found",
        });
      }
      // console.log("triggerResponse data", triggerResponse);
      return res.status(200).json({
        status: "success",
        data: [...triggerResponse, ...MultipleResposes],
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

//get one trigger response by particular Id
const getParticularTriggerResponse = async (req, res) => {
  const _id = req.params.id;
  //console.log(_id);
  try {
    const triggerResponse = await TriggerResModel.findById(_id);
    if (!triggerResponse) {
      return res.status(404).json({
        status: "error",
        message: "Trigger & Responses are not found",
      });
    } else {
      return res.status(200).json({ status: "success", data: triggerResponse });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

// here user can update there trigger and response
const updateTriggerResponseById = async (req, res) => {
  try {
    let { responseMsg, triggerText, suggestedTrigger, urlLabels } = req.body;
    const _id = req.params.id;

    if (triggerText) {
      triggerText = JSON.parse(triggerText);
    }
    if (suggestedTrigger) {
      suggestedTrigger = JSON.parse(suggestedTrigger);
    }
    if (urlLabels) {
      urlLabels = JSON.parse(urlLabels);
    }

    // Find the trigger response by its ID
    const triggerResponse = await TriggerResModel.findById(_id);

    if (!triggerResponse) {
      return res.status(404).json({
        status: "error",
        message: "Trigger response not found",
      });
    }

    let result;

    if (req.file) {
      result = await Cloudinary.uploader.upload(req.file.path);

      // Delete image with the previous Cloudinary ID if it exists
      if (triggerResponse.attachmentFileId) {
        await Cloudinary.uploader.destroy(triggerResponse.attachmentFileId);
      }
    }

    // Update the trigger response fields
    if (responseMsg) triggerResponse.responseMsg = responseMsg;
    if (triggerText) triggerResponse.triggerText = triggerText;
    if (suggestedTrigger) triggerResponse.suggestedTrigger = suggestedTrigger;
    if (urlLabels) triggerResponse.urlLabels = urlLabels;
    if (req.file) {
      triggerResponse.attachmentFile = result ? result.secure_url : "";
      triggerResponse.attachmentFileId = result ? result.public_id : "";
    }

    await triggerResponse.save();

    return res.status(200).json({
      status: "success",
      message: "Updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

// here user can delete there trigger response
const deleteTriggerResponseById = async (req, res) => {
  const _id = req.params.id;
  //console.log(_id);
  try {
    // Find the trigger response by its ID
    const user = await TriggerResModel.findById(_id);

    if (!user) {
      const userMulResponse = await MulTriggerResModel.findById(_id);
      if (userMulResponse) {
        await userMulResponse.deleteOne();
        return res.json({
          status: "success",
          message: "Deleted successfully!",
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "Trigger response not found",
        });
      }
    }

    // Check if the user has an attachmentFileId before trying to delete from Cloudinary
    if (user.attachmentFileId) {
      // Delete image with this Cloudinary ID
      await Cloudinary.uploader.destroy(user.attachmentFileId);
    }

    // Remove the document from the database
    await user.deleteOne(); // Use deleteOne() to remove the document

    return res.json({
      status: "success",
      message: "Deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Error Occurred",
    });
  }
};

const updateInitialResponse = async (req, res) => {
  try {
    const _id = req.params.id;
    const userId = req.userId;
    const { initialResponse } = req.body;
    if (!initialResponse) {
      return res.status(404).json({
        status: "error",
        message: "Initial response required",
      });
    }
    if (initialResponse != false) {
      const ResponseToUpdate = await TriggerResModel.findOne({
        userId,
        initialResponse,
      });
      if (ResponseToUpdate) {
        ResponseToUpdate.initialResponse = false;
        await ResponseToUpdate.save();
      }
    }
    const updatedResponse = await TriggerResModel.findById(_id);
    updatedResponse.initialResponse = initialResponse;
    await updatedResponse.save();
    return res.status(200).json({
      status: "success",
      message: "Initial response updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Error Occurred",
    });
  }
};

module.exports = {
  createData,
  getUserTriggerResponse,
  updateTriggerResponseById,
  deleteTriggerResponseById,
  getParticularTriggerResponse,
  updateInitialResponse,
};
