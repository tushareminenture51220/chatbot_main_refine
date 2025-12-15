const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".webp" &&
      ext !== ".pdf" &&
      ext !== ".gif" &&
      ext !== ".bmp" &&
      ext !== ".tiff" &&
      ext !== ".svg" &&
      ext !== ".xlsx" &&
      ext !== ".xls" &&
      ext !== ".xlsm" &&
      ext !== ".xlsb" &&
      ext !== ".pptx" &&
      ext !== ".ppt" &&
      ext !== ".pptm" &&
      ext !== ".docx" &&
      ext !== ".doc" &&
      ext !== ".docm" &&
      ext !== ".txt" &&
      ext !== ".csv" &&
      ext !== ".mp4" &&
      ext !== ".mp3" &&
      ext !== ".wav" &&
      ext !== ".avi" &&
      ext !== ".mov" &&
      ext !== ".zip" &&
      ext !== ".rar" &&
      ext !== ".tar" &&
      ext !== ".gz"
    ) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
