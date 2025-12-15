const { Router } = require("express");
const {
  createMsg,
  getChatMsg,
  deleteAllMessagesFunc,
  changeUserDeleteStatus,
} = require("../controllers/msg.controller");
const upload = require("../utils/multer");
const {
  createUser,
  getUsers,
  getParticularUser,
  initialCreateUser,
  chatTranscriptSendToMail,
} = require("../controllers/livechatuser.controller");
const {
  checkAssistant,
  getAssistnats,
  createAssistnats,
  getAssistantSuggestions,
  deleteMultipleAssistants,
} = require("../controllers/livechatassistant.controller");
// const multer = require("multer");
// const path = require("path");

const liveChatRouter = Router();

//create new msg

// const storageLiveChatAttachment = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/live_chat_attachements");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const uploadLiveChatAttachement = multer({
//   storage: storageLiveChatAttachment,
// });
liveChatRouter.post("/addmsg", upload.single("attachmentFile"), createMsg);

//get chat between two users
liveChatRouter.post("/getmsg", getChatMsg);

//delete all msg
liveChatRouter.delete("/deleteAllMessages/:id", deleteAllMessagesFunc);

//create user
liveChatRouter.post("/create-user/:id", createUser);

//get users
liveChatRouter.get("/get-users/:id", getUsers);

//get particular user
liveChatRouter.get("/get-puser/:id", getParticularUser);

//get Assistant
liveChatRouter.get("/get-assistants/:id", getAssistnats);

//changeUserDeleteStatus
liveChatRouter.patch(
  "/changeUserDeleteStatus/:id/:status",
  changeUserDeleteStatus
);
//create assistant user

// const storageMain = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/assistant_images");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const uploadAssistantImage = multer({
//   storage: storageMain,
// });
liveChatRouter.post(
  "/create-assistant",
  upload.single("assistantImage"),
  createAssistnats
);

//assistant check
liveChatRouter.patch("/check-assistant/:id", checkAssistant);

//search assistant
liveChatRouter.get("/get-assistant/:userId/:value", getAssistantSuggestions);

// deleteMultipleAssistants
liveChatRouter.delete("/deleteMultipleAssistants", deleteMultipleAssistants);

liveChatRouter.post("/chat-transcript", chatTranscriptSendToMail);

module.exports = liveChatRouter;
