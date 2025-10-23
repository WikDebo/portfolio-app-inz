const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/portfolio.controller");
const uploadPortfolioFile = require("../middleware/upload");
const checkPortfolioExists = require("../middleware/checkPortfolio");
const checkCategoryExists = require("../middleware/checkCategory");

//CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});

// Upload photos to portfolio + add title and desc
router.post(
  "/user/portfolio/create",
  authJwt.verifyToken,
  controller.createPortfolio
);
router.post(
  "/user/portfolio/upload/:id",
  authJwt.verifyToken,
  checkPortfolioExists,
  uploadPortfolioFile.single('image'),
  checkCategoryExists,
  controller.uploadPortfolioFiles
);
router.post(
  "/user/portfolio/category/create",
  authJwt.verifyToken, 
  checkPortfolioExists,
  controller.addCategory
);
//edit portfolio info
router.put(
  "/user/portfolio/edit",
  authJwt.verifyToken,
  controller.editPortfolio
);
router.put(
  "/user/portfolio/category/:id/edit",
  authJwt.verifyToken,
  controller.editCategory
);


// Get all files + portfolio info of the logged-in user + chosen user
router.get("/user/portfolio", authJwt.verifyToken, controller.getMyPortfolio);
router.get("/user/portfoliofiles", authJwt.verifyToken, controller.getMyPortfolioFiles);

router.get("/:userId/portfolio", authJwt.verifyToken, controller.getPortfolio);
router.get("/:userId/portfoliofiles", authJwt.verifyToken, controller.getPortfolioFiles);

// Delete a  file
router.delete("user/portfolio/:id", authJwt.verifyToken, controller.deletePortfolioFiles);

module.exports = router;
