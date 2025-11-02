const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/gallery.controller");
const uploadFile = require("../middleware/upload");
const checkFileExists = require("../middleware/checkFile");
const checkPermission = require("../middleware/checkPermission");

// Handle CORS headers if needed
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});

// Upload a single file
router.post(
  "/user/upload",
  authJwt.verifyToken,
  uploadFile.single('file'),
  controller.uploadGalleryFiles
);

// Get all files of the logged-in user + chosen user
router.get("/user/files", authJwt.verifyToken, controller.getMyGalleryFiles);
router.get("/:username/files", authJwt.verifyToken, controller.getUserGallery);
// Delete a file by ID (only owner)
router.delete("/user/files/:id", authJwt.verifyToken, checkFileExists, checkPermission, controller.deleteFile);

module.exports = router;
