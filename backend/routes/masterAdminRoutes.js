const { Router } = require("express");
const upload = require("../utils/multer");
const {
  createMasterAdminUser,
  loginMasterAdminUser,
} = require("../controllers/masterAdminUser.controller");
const {
  linkedAccountwithMasterAdmin,
  AddAccountsWithMasterAdmin,
  getAddedAccountswithMasterAdmin,
  deleteLinkedAccounts,
  getParticularAccountsUser,
  createAssistantofMasterAdmin,
  getMasterAdminAssistnats,
} = require("../controllers/MasterAccounts.controller");
const {
  checkAssistantMA,
  getAssistantSuggestionsMA,
  deleteMultipleAssistantsMA,
  deleteAllMessagesFuncMA,
} = require("../controllers/masterAdminAssistant.controller");

const masterAdminRouter = Router();

// create user and authorization
masterAdminRouter.post("/create-user", createMasterAdminUser);

masterAdminRouter.post("/login-user", loginMasterAdminUser);

// linked accounts with master admin for otp sending
masterAdminRouter.post("/linked-accounts", linkedAccountwithMasterAdmin);

// add acounts with master admin
masterAdminRouter.post("/add-account", AddAccountsWithMasterAdmin);

// get added accounts
masterAdminRouter.get("/get-accounts/:id", getAddedAccountswithMasterAdmin);

// delete accounts or unlinked accounts with master admin
masterAdminRouter.delete("/delete-linked-accounts", deleteLinkedAccounts);

// masterAdminRouter.delete("/deleteAllMessages/:id", deleteAllMessagesFuncMA);
// get particualr admin data
masterAdminRouter.post(
  "/get-particular-accounts-user",
  getParticularAccountsUser
);

//  create master admin Assistant
masterAdminRouter.post(
  "/create-assistant",
  upload.single("assistantImage"),
  createAssistantofMasterAdmin
);

masterAdminRouter.get("/get-assistants/:id", getMasterAdminAssistnats);

//assistant check
masterAdminRouter.patch("/check-assistant/:id", checkAssistantMA);

//search assistant
masterAdminRouter.get(
  "/get-assistant/:userId/:value",
  getAssistantSuggestionsMA
);

// deleteMultipleAssistants
masterAdminRouter.delete(
  "/deleteMultipleAssistants",
  deleteMultipleAssistantsMA
);

module.exports = masterAdminRouter;
