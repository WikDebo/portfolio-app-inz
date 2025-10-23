const db = require("../models");
const PortfolioFiles = db.portfolioFiles;
const Portfolio = db.portfolios;
const Category = db.category;
const fs = require("fs");
const path = require("path");

exports.createPortfolio = async (req, res) => {
  try {
    await Portfolio.create({
      title: req.body.title,
      description: req.body.description || null,
      userId: req.userId,
    });

    res.status(201).json({
      message: "Portfolio updated successfully",
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      message: `Could not update the portfolio.`,
      error: err.message,
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const category = await Category.create({
      categoryName: req.body.title,
      description: req.body.description || null,
      portfolioId: req.portfolio.id,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({
      message: "Could not create category.",
      error: err.message,
    });
  }
};

exports.uploadPortfolioFiles = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "You must select a file." });
  }

  try {
    const addedFile = await PortfolioFiles.create({
      fileName: req.file.originalname,
      caption: req.body.caption || null,
      path: req.file.path,
      categoryId: req.category.id,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: addedFile,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      message: `Could not upload the file: ${req.file.originalname}`,
      error: err.message,
    });
  }
};
exports.getMyPortfolioFiles = async (req, res) => {
  try {
    const files = await PortfolioFiles.findAll({
      include: [
        {
          model: Category,
          include: [{ model: Portfolio, where: { userId: req.userId } }],
        },
      ],
    });

    res.status(200).json(files);
  } catch (err) {
    console.error("Error getting files:", err);
    res.status(500).json({
      message: "Error fetching files",
      error: err.message,
    });
  }
};
exports.getPortfolioFiles = async (req, res) => {
  try {
    const userId = req.params.userId;

    const files = await PortfolioFiles.findAll({
      include: [
        {
          model: Category,
          include: [{ model: Portfolio, where: { userId } }],
        },
      ],
    });

    res.status(200).json(files);
  } catch (err) {
    console.error("Get portfolio files error:", err);
    res
      .status(500)
      .json({ message: "Error fetching files", error: err.message });
  }
};
exports.getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: { userId: req.userId },
    });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.json(portfolio);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving portfolio", error: err.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: { userId: req.params.userId },
    });
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });
    res.json(portfolio);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving portfolio", error: err.message });
  }
};

exports.getCategory = async (req, res) => {};

exports.editPortfolio = async (req, res) => {
  try {
    const [updated] = await Portfolio.update(
      {
        title: req.body.title,
        description: req.body.description || null,
      },
      { where: { userId: req.userId } }
    );

    if (updated) return res.json({ message: "Portfolio updated successfully" });
    res.status(404).json({ message: "Portfolio not found" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating portfolio", error: err.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(
      {
        categoryName: req.body.categoryName,
        description: req.body.description || null,
      },
      { where: { id: req.params.categoryId } }
    );

    if (updated) return res.json({ message: "Category updated successfully" });
    res.status(404).json({ message: "Category not found" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating category", error: err.message });
  }
};

exports.deletePortfolioFiles = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const fileId = req.params.id;

    const file = await PortfolioFiles.findOne({ where: { id: fileId } });
    if (!file) return res.status(404).json({ message: "File not found" });

    // Authorization
    const portfolio = await Portfolio.findByPk(file.portfolioId);
    if (userRole !== "admin" && portfolio.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this file" });
    }

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    await PortfolioFiles.destroy({ where: { id: fileId } });
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete file error:", err);
    res
      .status(500)
      .json({ message: "Error deleting file", error: err.message });
  }
};
exports.deletePortfolioInfo = async (req, res) => {};
exports.deleteCategory = async (req, res) => {};
