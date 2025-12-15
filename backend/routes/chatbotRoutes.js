const { Router } = require("express");
const auth = require("../middlewares/auth");
const upload = require("../utils/multer");
const {
  createData,
  getUserTriggerResponse,
  updateTriggerResponseById,
  deleteTriggerResponseById,
  getParticularTriggerResponse,
  updateInitialResponse,
  getPeviewPage,
} = require("../controllers/chatbot.controller");
const {
  createMultipleResponses,
  getMultipleResParticularDocument,
} = require("../controllers/multipleresponse.controller");
const {
  resetJoinedExecutiveStatus,
} = require("../controllers/livechatuser.controller");

const chatbotRouter = Router();

//multer

//all are protected routes - need JWT token

//post trigger and response data
chatbotRouter.post(
  "/create-data",
  auth,
  upload.single("attachmentFile"),
  createData
);

//post multiple responses and one trigger
chatbotRouter.post(
  "/create-multiple-responses",
  auth,
  upload.single("attachmentFile"),
  createMultipleResponses
);
//get data for particular user
chatbotRouter.get("/get-data", auth, getUserTriggerResponse);

// udpate particular data by Object _id
chatbotRouter.patch(
  "/update-data/:id",
  auth,
  upload.single("attachmentFile"),
  updateTriggerResponseById
);

// delete data particular data by Object _id
chatbotRouter.delete("/delete-data/:id", auth, deleteTriggerResponseById);

//get particular trigger response by id
chatbotRouter.get(
  "/get-particular-data/:id",
  auth,
  getParticularTriggerResponse
);

//getMultipleResParticularDocument
chatbotRouter.get(
  "/get-multiple-presponse/:id",
  auth,
  getMultipleResParticularDocument
);
//update initial trigger
chatbotRouter.patch(
  "/update-initial-response/:id",
  auth,
  updateInitialResponse
);

chatbotRouter.patch(
  "/resetJoinedExecutiveStatus/:assistantId",
  resetJoinedExecutiveStatus
);

module.exports = chatbotRouter;
