const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const searchController = require("../controllers/search.controller");

router.get("/search", [authJwt.verifyToken], searchController.searchEverything);

module.exports = router;