const { Router } = require("express");
const upload = require("../utils/multer");
const {
  ImageUploader,
  ImageDelete,
} = require("../controllers/imageCRUD.controller");
const imageRouter = Router();

imageRouter.post("/uploadImage", upload.single("image"), ImageUploader);
imageRouter.delete("/deleteImage/:id", ImageDelete);

module.exports = imageRouter;
