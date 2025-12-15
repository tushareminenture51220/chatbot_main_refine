const Cloudinary = require("../utils/cloudinary");
const ImageUploader = async (req, res) => {
  try {
    let result;
    if (req.file) {
      result = await Cloudinary.uploader.upload(req.file.path);
    }
    if (result) {
      return res.status(201).json({
        status: "success",
        message: "Image uploaded successfully",
        imageURL: result ? result.secure_url : "",
        imageId: result ? result.public_id : "",
      });
    } else {
      return res.status(201).json({
        status: "success",
        message: "Error while uploading image",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const ImageDelete = async (req, res) => {
  try {
    let imageId = req.params.id;
    if (imageId) {
      await Cloudinary.uploader.destroy(imageId);
      return res.status(201).json({
        status: "success",
        message: "Image Deleted successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

module.exports = { ImageUploader, ImageDelete };
