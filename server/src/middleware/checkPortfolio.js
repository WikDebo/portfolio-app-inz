const db = require("../models");
const Portfolio = db.portfolios;

module.exports = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ where: { userId: req.userId } });

    if (!portfolio) {
      return res.status(400).json({ message: "You must create a portfolio first." });
    }

    req.portfolio = portfolio;
    next();
  } catch (err) {
    console.error("checkPortfolioExists error:", err);
    res.status(500).json({ message: "Error checking portfolio", error: err.message });
  }
};