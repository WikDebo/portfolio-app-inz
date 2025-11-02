const express = require("express");
const router = express.Router();
const controller = require("../controllers/connections.controller");
const changeStatusToSeen = require("../middleware/markNotificationsSeen");
const { authJwt } = require("../middleware");

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Follow / Unfollow
router.post("/", [authJwt.verifyToken], controller.createConnection);
router.delete("/", [authJwt.verifyToken], controller.unfollow);

// Notifications
router.get("/notifications", [authJwt.verifyToken, changeStatusToSeen], controller.getNotifications);

// Follower stats
router.get("/stats/:username", [authJwt.verifyToken], controller.getFollowerStats);

// Check follow status
router.get("/status/:username", [authJwt.verifyToken], controller.checkFollowStatus);

module.exports = router;
