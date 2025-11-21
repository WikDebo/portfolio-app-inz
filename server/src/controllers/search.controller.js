const db = require("../models");
const User = db.users;
const Portfolio = db.portfolios;
const GalleryFiles = db.galleryFiles;
const { Op } = require("sequelize");

exports.searchEverything = async (req, res) => {
  try {
    const query = req.query.query || "*";
    const searchTerm = query === "*" ? "" : query;

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${searchTerm}%` } },
          { bio: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ["id", "username", "profilephoto", "bio"],
      limit: 20
    });

    const portfolios = await Portfolio.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      include: [
        { model: User, as: "user", attributes: ["id", "username", "profilephoto"] }
      ],
      limit: 20
    });

    const gallery = await GalleryFiles.findAll({
      where: { caption: { [Op.like]: `%${searchTerm}%` } },
      include: [
        { model: User, as: "user", attributes: ["id", "username", "profilephoto"] }
      ],
      limit: 20
    });

    res.json({ users, portfolios, gallery });
  } catch (err) {
    res.status(500).json({ error: "Search failed." });
  }
};
