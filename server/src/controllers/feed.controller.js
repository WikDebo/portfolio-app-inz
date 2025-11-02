const db = require("../models");
const GalleryFiles = db.galleryFiles;
const Likes = db.likes;
const Connections = db.connections;
const User = db.users;
const { Op, fn, col, literal } = db.Sequelize;

exports.getFeed = async (req, res) => {
  try {
    const userId = req.userId;
    //ID of the following user
    const following = await Connections.findAll({
      where: { followerId: userId },
      attributes: ["followingId"],
    });
    //Feed made of followers
    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId);

    // Uploads of followers
    const newUploads = await GalleryFiles.findAll({
      where: { userId: { [Op.in]: followingIds } },
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilephoto"],
        },
        {
          model: Likes,
          as: "likes",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // popularity of posts
    const popular = await GalleryFiles.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilephoto"],
        },
        {
          model: Likes,
          as: "likes",
          attributes: [],
        },
      ],
      attributes: {
        include: [[fn("COUNT", col("likes.id")), "likeCount"]],
      },
      group: ["gallery_files.id"],
      order: [[literal("likeCount"), "DESC"]],
      limit: 10,
      subQuery: false,
    });

    //Activity on following
    const activity = await GalleryFiles.findAll({
      where: { userId: { [Op.in]: followingIds } },
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilephoto"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // Formatting with g
    const formatGallery = (g, type) => ({
      type,
      id: g.id,
      fileName: g.fileName,
      path: g.path,
      caption: g.caption,
      createdAt: g.createdAt,
      user: g.User,
      likeCount: g.get("likeCount") || (g.likes ? g.likes.length : 0),
    });

    // Merge the feed through map
    const feedMap = new Map();
    [
      ...newUploads.map((g) => formatGallery(g, "new_upload")),
      ...popular.map((g) => formatGallery(g, "popular")),
      ...activity.map((g) => formatGallery(g, "activity")),
    ].forEach((item) => {
      if (!feedMap.has(item.id)) feedMap.set(item.id, item);
    });

    const feed = Array.from(feedMap.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 30);

    return res.status(200).json(feed);
  } catch (err) {
    console.error("Feed error:", err);
    return res.status(500).json({
      message: "Error building feed",
      error: err.message,
    });
  }
};
