const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/portfolio.controller");
const uploadPortfolioFile = require("../middleware/upload");
const checkPortfolioExists = require("../middleware/checkPortfolio");
const checkCategoryExists = require("../middleware/checkCategory");

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});
// Upload photos to portfolio + add title and desc
router.post(
  "/user/create",
  authJwt.verifyToken,
  controller.createPortfolio
);
router.post(
  "/user/category/create",
  authJwt.verifyToken, 
  checkPortfolioExists,
  controller.addCategory
);
router.post(
  "/user/upload/:categoryId",
  authJwt.verifyToken,
  checkPortfolioExists,
  uploadPortfolioFile.single('image'),
  checkCategoryExists,
  controller.uploadPortfolioFiles
);

//edit portfolio info
router.put(
  "/user/edit",
  authJwt.verifyToken,
  controller.editPortfolio
);
router.put(
  "/user/category/:categoryId/edit",
  authJwt.verifyToken,
  controller.editCategory
);

// Get all files + portfolio info of the logged-in user + chosen user
router.get("/user", authJwt.verifyToken, controller.getMyPortfolio);
router.get("/files/user/", authJwt.verifyToken, controller.getMyPortfolioFiles);
router.get("/category/user", authJwt.verifyToken, controller.getMyCategories);

router.get("/:username", authJwt.verifyToken, controller.getPortfolio); //change to username
router.get("/files/:username", authJwt.verifyToken, controller.getPortfolioFiles);//change to username not worky
router.get("/category/:username", authJwt.verifyToken, controller.getUserCategories);//change to username

//get categories
// Delete a  file
//router.delete("user/:fileId", authJwt.verifyToken, controller.deletePortfolioFiles);
router.delete(
  "/user/files",
  authJwt.verifyToken,
  checkPortfolioExists,
  controller.deletePortfolioInfo
);
router.delete(
  "/user/category/:categoryId",
  authJwt.verifyToken,
  checkCategoryExists,
  controller.deleteCategory 
);
module.exports = router;
