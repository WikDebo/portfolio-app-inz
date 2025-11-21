const express = require("express");
const router = express.Router();
const likesController = require("../controllers/likes.controller");
const { authJwt } = require("../middleware");
const changeStatusToSeen = require("../middleware/markLikeNotificationSeen");

// Like / Unlike
router.post("/like", [authJwt.verifyToken], likesController.likeFile);
router.post("/unlike", [authJwt.verifyToken], likesController.unlikeFile);

// Get likes
router.get("/file/:fileId", [authJwt.verifyToken], likesController.getFileLikes);
router.get("/status/:fileId", [authJwt.verifyToken], likesController.checkLikeStatus);
router.get("/count/:fileId", [authJwt.verifyToken], likesController.getLikeCount);
router.get("/user/:username", [authJwt.verifyToken], likesController.getUserLikes);
// Notifications
router.get("/notifications", [authJwt.verifyToken, changeStatusToSeen], likesController.getLikeNotifications);

module.exports = router;
