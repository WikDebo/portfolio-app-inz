
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, cb) => 
    cb(null, __basedir + "/resources/static/assets/uploads/"),
  filename: (req, file, cb) => 
    cb(null, Date.now() + path.extname(file.originalname)),
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
});

module.exports = uploadFile;