const util = require("util");
const multer = require("multer");
//const maxSize = 4 * 1024 * 1024;

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => 
    cb(null, __basedir + "/resources/static/assets/uploads/"),
  filename: (req, file, cb) => {
  cb(null, `${Date.now()}-portfolio-${file.originalname}`);
}
});

const uploadPortfolioFile = multer({
  storage: storage,
  fileFilter: imageFilter,
  ///limits: { fileSize: maxSize },
})


module.exports = uploadPortfolioFile;