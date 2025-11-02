const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const feedController = require("../controllers/feed.controller");

router.get("/", [authJwt.verifyToken], feedController.getFeed);

module.exports = router;
