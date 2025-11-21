const db = require("../models");
const User = db.users;
const Connections = db.connections;
const GalleryFiles = db.galleryFiles;
const Likes = db.likes;
const { Op, fn, col } = require("sequelize");

// Popular (home) feed
exports.getHomeFeed = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await GalleryFiles.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profilephoto"]
        },
        {
          model: Likes,
          as: "likes",
          attributes: [],
          required: false, // Include posts with no likes
        }
      ],
      attributes: {
        include: [[fn("COUNT", col("likes.id")), "likeCount"]],
      },

      group: ["gallery_files.id", "user.id"],
      order: [[fn("COUNT", col("likes.id")), "DESC"]], //Creates a object representing a database function. This can be used in search queries, both in where and order parts, and as default values in column definitions.
      offset,
      limit,
      subQuery: false, //Pagination
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load home feed." });
  }
};
//following page
exports.getFollowingFeed = async (req, res) => {
  try {
    const userId = req.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const following = await Connections.findAll({
      where: { followerId: userId },
      attributes: ["followingId"]
    });
    const followingIds = following.map(f => f.followingId);

    if (!followingIds.length) return res.json([]);

    const posts = await GalleryFiles.findAll({
      where: { userId: { [Op.in]: followingIds } },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profilephoto"]
        },
        {
          model: Likes,
          as: "likes",
          attributes: [],
          required: false, 
        }
      ],
      attributes: {
        include: [[fn("COUNT", col("likes.id")), "likeCount"]],
      },
      group: ["gallery_files.id", "user.id"],
      order: [["createdAt", "DESC"]],
      offset,
      limit,
      subQuery: false,
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load following feed." });
  }
};
