const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/gallery.controller");
const uploadFile = require("../middleware/upload");

// CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});

// Upload a single file
router.post(
  "/upload",
  authJwt.verifyToken,
  uploadFile.single('file'),
  controller.uploadGalleryFiles
);

// Get all files of the logged-in user (my gallery)
router.get("/my-files", authJwt.verifyToken, controller.getMyGalleryFiles);

// Delete a file by ID (only owner)
router.delete("/files/:id", authJwt.verifyToken, controller.deleteFile);

module.exports = router;
