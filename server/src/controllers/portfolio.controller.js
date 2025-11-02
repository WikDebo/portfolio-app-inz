const db = require("../models");
const PortfolioFiles = db.portfolioFiles;
const Portfolio = db.portfolios;
const Category = db.category;
const fs = require("fs");
const path = require("path");
const User = db.users;
exports.createPortfolio = async (req, res) => {
  try {
    const userId = req.userId;

    const existingPortfolio = await Portfolio.findOne({ where: { userId } });
    if (existingPortfolio) {
      return res.status(400).json({ message: "You already have a portfolio." });
    }

    const user = await User.findByPk(userId, { attributes: ["username"] });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const title = req.body.title?.trim() || `${user.username}'s Portfolio`;

    await Portfolio.create({
      title,
      description: req.body.description || `This is my first portfolio.`,
      userId,
    });

    res.status(201).json({
      message: "Portfolio created successfully",
    });
  } catch (err) {
    console.error("Error creating portfolio:", err);
    res.status(500).json({
      message: "Could not create the portfolio.",
      error: err.message,
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const portfolioId = req.portfolio?.id || req.portfolioId;

    if (!portfolioId) {
      return res.status(400).json({ message: "Portfolio ID is required." });
    }

    const categoryCount = await Category.count({ where: { portfolioId } });

    const categoryName =
      req.body.categoryName?.trim() || `Category ${categoryCount + 1}`;

    const category = await Category.create({
      categoryName,
      description: req.body.description || null,
      portfolioId,
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
  const username = req.params.username;
  try {
    const user = await User.findOne({
      where: { username: username },
      attributes: ["id"],
    });
    const files = await PortfolioFiles.findAll({
      include: [
        {
          model: Category,
          include: [{ model: Portfolio, where: { userId: user.id } }],
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
  const username = req.params.username;
  try {
    const user = await User.findOne({
      where: { username: username },
      attributes: ["id"],
    });

    const portfolio = await Portfolio.findOne({ where: { userId: user.id } });
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });
    res.json(portfolio);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving portfolio", error: err.message });
  }
};

exports.getMyCategories = async (req, res) => {
  try {
    const userId = req.userId;

    const categories = await Category.findAll({
      include: [
        {
          model: Portfolio,
          where: { userId },
          attributes: ["id", "title"],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({
      message: "Error fetching categories",
      error: err.message,
    });
  }
};
exports.getUserCategories = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({
      where: { username: username },
      attributes: ["id"],
    });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    const categories = await Category.findAll({
      include: [
        {
          model: Portfolio,
          where: { userId: user.id },
          attributes: ["id", "title"],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching user categories:", err);
    res.status(500).json({
      message: "Error fetching categories for user",
      error: err.message,
    });
  }
};
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
exports.deletePortfolioInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const { fileIds } = req.body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide fileIds as an array." });
    }

    const files = await PortfolioFiles.findAll({
      where: { id: fileIds },
      include: [
        {
          model: Category,
          include: [{ model: Portfolio, where: { userId } }],
        },
      ],
    });

    if (files.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching files found for this user." });
    }

    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path); // delete file from storage
      }
      await PortfolioFiles.destroy({ where: { id: file.id } });
    }

    res.json({
      message: "Selected photos deleted successfully.",
      deletedCount: files.length,
    });
  } catch (err) {
    console.error("Error deleting selected photos:", err);
    res.status(500).json({
      message: "Error deleting selected photos",
      error: err.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const categoryId = req.params.categoryId;

    const category = await Category.findOne({
      where: { id: categoryId },
      include: [{ model: Portfolio }],
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (userRole !== "admin" && category.portfolio.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this category" });
    }

    await PortfolioFiles.destroy({ where: { categoryId } });

    await Category.destroy({ where: { id: categoryId } });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({
      message: "Error deleting category",
      error: err.message,
    });
  }
};
