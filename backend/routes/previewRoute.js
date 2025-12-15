const { Router } = require("express");

const {
  getPeviewPage,
  getUserTriggerResponse,
  getUser,
} = require("../controllers/preview.controller");

const previewRouter = Router();
//get preview page
//preview
previewRouter.get("/get-preview/:id", getPeviewPage);
previewRouter.get("/get-data/:id", getUserTriggerResponse);
previewRouter.get("/get-user/:id", getUser);

module.exports = previewRouter;
