const db = require("../models");
const Category = db.category;
const Portfolio = db.portfolios;

module.exports = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    // find category and check the portfolio id to check user id
    const category = await Category.findOne({
      where: { id: categoryId },
      include: [
        {
          model: Portfolio,
           as: "portfolio",
          where: { userId: req.userId },
          required: true,
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found or does not belong to your portfolio.",
      });
    }

    req.category = category;
    next();
  } catch (err) {
    console.error("checkCategoryExists error:", err);
    res.status(500).json({
      message: "Error checking category",
      error: err.message,
    });
  }
};