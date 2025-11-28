const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const feedController = require("../controllers/feed.controller");

router.get("/home", [authJwt.verifyToken], feedController.getHomeFeed);
router.get("/following", [authJwt.verifyToken], feedController.getFollowingFeed);


module.exports = router;
