const db = require("../models");
const Portfolio = db.portfolios;
const Category = db.category;
const PortfolioFiles = db.portfolioFiles;
const User = db.users;
const fs = require("fs");

// PORTFOLIO 
//add
exports.createPortfolio = async (req, res) => {
  try {
    const userId = req.userId;
    const existing = await Portfolio.findOne({ where: { userId } });
    if (existing)
      return res.status(400).json({ message: "You already have a portfolio." });

    const user = await User.findByPk(userId, { attributes: ["username"] });
    if (!user) return res.status(404).json({ message: "User not found." });

    const title = req.body.title?.trim() || `${user.username}'s Portfolio`;
    const portfolio = await Portfolio.create({
      title,
      description: req.body.description || "This is my first portfolio.",
      userId,
    });

    res.status(201).json({ message: "Portfolio created successfully", portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create portfolio", error: err.message });
  }
};
//get logged users
exports.getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: { userId: req.userId },
      include: [
        {
          model: Category,
          as: "categories",
          include: [
            { model: PortfolioFiles, as: "portfolioFiles", attributes: ["id", "fileName", "path"] },
          ],
        },
      ],
      order: [[{ model: Category, as: "categories" }, "id", "ASC"]],
    });

    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error fetching portfolio", error: err.message });
  }
};
//get other users
exports.getPortfolio = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: ["id", "username"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const portfolio = await Portfolio.findOne({
      where: { userId: user.id },
      include: [
        {
          model: Category,
          as: "categories",
          include: [
            { model: PortfolioFiles, as: "portfolioFiles", attributes: ["id", "fileName", "path"] },
          ],
        },
      ],
      order: [[{ model: Category, as: "categories" }, "id", "ASC"]],
    });

    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error fetching portfolio", error: err.message });
  }
};
//edit
exports.editPortfolio = async (req, res) => {
  try {
    const [updated] = await Portfolio.update(
      { title: req.body.title, description: req.body.description || null },
      { where: { userId: req.userId } }
    );
    if (!updated) return res.status(404).json({ message: "Portfolio not found." });

    const portfolio = await Portfolio.findOne({ where: { userId: req.userId } });
    res.json({ message: "Portfolio updated", portfolio });
  } catch (err) {
    res.status(500).json({ message: "Error updating portfolio", error: err.message });
  }
};

//CATEGORIES
//add
exports.addCategory = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ where: { userId: req.userId } });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });

    const count = await Category.count({ where: { portfolioId: portfolio.id } });
    const categoryName = req.body.categoryName?.trim() || `Category ${count + 1}`;

    const category = await Category.create({
      categoryName,
      description: req.body.description || null,
      portfolioId: portfolio.id,
    });

    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: "Could not create category", error: err.message });
  }
};
//get for link
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.categoryId },
      include: [
        { model: Portfolio, as: "portfolio", attributes: ["id", "userId"] },
        { model: PortfolioFiles, as: "portfolioFiles", attributes: ["id", "fileName", "caption", "path"] }
      ]
    });

    if (!category) return res.status(404).json({ message: "Category not found." });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category details", error: err.message });
  }
};
//get all logged users cats
exports.getMyCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Portfolio, as: "portfolio", where: { userId: req.userId }, attributes: ["id"] }],
      order: [["id", "ASC"]],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};
//get non logged users cats
exports.getMyCategoryById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ where: { userId: req.userId }, attributes: ["id"] });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    const category = await Category.findOne({
      where: { id: req.params.categoryId, portfolioId: portfolio.id },
      include: [{ model: PortfolioFiles, as: "portfolioFiles", attributes: ["id", "fileName", "caption", "path", "categoryId"] }],
    });

    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching category", error: err.message });
  }
};
//other users for link
exports.getUserCategoryById = async (req, res) => {
  try {
    const { username, categoryId } = req.params;
    const user = await User.findOne({ where: { username }, attributes: ["id"] });
    if (!user) return res.status(404).json({ message: "User not found." });

    const portfolio = await Portfolio.findOne({ where: { userId: user.id }, attributes: ["id"] });
    const category = await Category.findOne({
      where: { id: categoryId, portfolioId: portfolio.id },
      include: [{ model: PortfolioFiles, as: "portfolioFiles", attributes: ["id", "fileName", "caption", "path", "categoryId"] }]
    });

    if (!category) return res.status(404).json({ message: "Category not found." });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching category", error: err.message });
  }
};
//list of all non logged users
exports.getUserCategories = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username }, attributes: ["id"] });
    if (!user) return res.status(404).json({ message: "User not found." });

    const categories = await Category.findAll({
      include: [{ model: Portfolio, as: "portfolio", where: { userId: user.id }, attributes: ["id"] }],
      order: [["id", "ASC"]],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};
//edit cat
exports.editCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(
      { categoryName: req.body.categoryName, description: req.body.description || null },
      { where: { id: req.params.categoryId } }
    );
    if (!updated) return res.status(404).json({ message: "Category not found." });
    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err.message });
  }
};
//del cat + files
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.categoryId },
      include: [{ model: Portfolio, as: "portfolio" }]
    });
    if (!category) return res.status(404).json({ message: "Category not found." });

    if (req.userRole !== "admin" && category.portfolio.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const files = await PortfolioFiles.findAll({ where: { categoryId: category.id } });
    for (const file of files) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      await PortfolioFiles.destroy({ where: { id: file.id } });
    }

    await Category.destroy({ where: { id: category.id } });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err.message });
  }
};

//PORTFOLIO FILES 
//upload
exports.uploadPortfolioFiles = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded." });

  try {
    const portfolio = await Portfolio.findOne({ where: { userId: req.userId } });
    const category = await Category.findByPk(req.params.categoryId);
    if (!portfolio || !category) return res.status(404).json({ message: "Portfolio or category not found." });

    const file = await PortfolioFiles.create({
      fileName: req.file.originalname,
      caption: req.body.caption || null,
      path: `/uploads/${req.file.filename}`,
      categoryId: category.id,
      portfolioId: portfolio.id,
    });

    res.status(201).json({ message: "File uploaded", file });
  } catch (err) {
    res.status(500).json({ message: "Could not upload file", error: err.message });
  }
};
//logged users files
exports.getMyPortfolioFiles = async (req, res) => {
  try {
    const files = await PortfolioFiles.findAll({
      include: [
        { 
          model: Category, 
          as: "category", 
          attributes: ["id", "categoryName"], 
          include: [
            { model: Portfolio, as: "portfolio", where: { userId: req.userId }, attributes: ["id"] }
          ] 
        }
      ],
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Error fetching files", error: err.message });
  }
};
//non logged usres files
exports.getPortfolioFiles = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username }, attributes: ["id"] });
    if (!user) return res.status(404).json({ message: "User not found." });

    const files = await PortfolioFiles.findAll({
      include: [
        { 
          model: Category, 
          as: "category", 
          attributes: ["id", "categoryName"], 
          include: [
            { model: Portfolio, as: "portfolio", where: { userId: user.id }, attributes: ["id"] }
          ] 
        }
      ],
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Error fetching files", error: err.message });
  }
};
//delete files + admin (not used)
exports.deletePortfolioFiles = async (req, res) => {
  try {
    const file = await PortfolioFiles.findByPk(req.params.id, 
      { include: [
        { 
          model: Category, 
          as: "category", 
          attributes: ["id", "categoryName"],
          include: [
            { model: Portfolio, as: "portfolio"}
          ] 
        }
      ], });
    if (!file) return res.status(404).json({ message: "File not found." });

    if (req.userRole !== "admin" && file.category.portfolio.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized." });
    }

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    await PortfolioFiles.destroy({ where: { id: file.id } });

    res.json({ message: "File deleted." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting file", error: err.message });
  }
};

