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
  "/user/upload",
  authJwt.verifyToken,
  uploadFile.single('file'),
  controller.uploadGalleryFiles
);

// Get all files of the logged-in user + selected user
router.get("/user/files", authJwt.verifyToken, controller.getMyGalleryFiles);
router.get("/:userId/files", authJwt.verifyToken, controller.getUserGallery);
// Delete a file 
router.delete("/user/files/:id", authJwt.verifyToken, controller.deleteFile);

module.exports = router;
