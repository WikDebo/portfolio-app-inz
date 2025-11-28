const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/portfolio.controller");
const uploadPortfolioFile = require("../middleware/upload");
const checkPortfolioExists = require("../middleware/checkPortfolio");
const checkCategoryExists = require("../middleware/checkCategory");

// Handle CORS headers if needed
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});

// Portfolio routes
router.get("/user", authJwt.verifyToken, controller.getMyPortfolio);
router.get("/:username", authJwt.verifyToken, controller.getPortfolio);
router.post("/user/create", authJwt.verifyToken, controller.createPortfolio);
router.put("/user/edit", authJwt.verifyToken, controller.editPortfolio);

// Category routes
router.post(
  "/user/category/create",
  authJwt.verifyToken,
  checkPortfolioExists,
  controller.addCategory
);

router.put("/user/category/:categoryId/edit", authJwt.verifyToken, controller.editCategory);
router.delete("/user/category/:categoryId/delete", authJwt.verifyToken, controller.deleteCategory);

router.get("/category/user", authJwt.verifyToken, controller.getMyCategories);
router.get("/category/:username", authJwt.verifyToken, controller.getUserCategories);
router.get("/category/user/:categoryId", authJwt.verifyToken, controller.getMyCategoryById);
router.get("/category/:username/:categoryId", authJwt.verifyToken, controller.getUserCategoryById);

//Portfolio files routes
router.post(
  "/user/upload/:categoryId",
  authJwt.verifyToken,
  checkPortfolioExists,
  uploadPortfolioFile.single("image"),
  checkCategoryExists,
  controller.uploadPortfolioFiles
);
router.get("/files/user", authJwt.verifyToken, controller.getMyPortfolioFiles);
router.get("/files/:username", authJwt.verifyToken, controller.getPortfolioFiles);
router.delete("/user/files/:id", authJwt.verifyToken, controller.deletePortfolioFiles);

module.exports = router;