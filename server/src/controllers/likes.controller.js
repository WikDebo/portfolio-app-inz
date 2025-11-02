const db = require("../models");
const Likes = db.likes;
const GalleryFiles = db.galleryFiles;
const User = db.users;

// Like a file
exports.likeFile = async (req, res) => {
  try {
    const userId = req.userId;
    const fileId = req.body.fileId;

    if (!fileId) return res.status(400).send({ message: "fileId is required" });

    const existingLike = await Likes.findOne({ where: { userId, fileId } });
    if (existingLike) {
      return res.status(400).send({ message: "You already liked this file." });
    }

    await Likes.create({ userId, fileId, likedAt: new Date(), status: "new" });
    res.status(201).send({ message: "File liked successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Unlike a file
exports.unlikeFile = async (req, res) => {
  try {
    const userId = req.userId;
    const fileId = req.body.fileId;

    if (!fileId) return res.status(400).send({ message: "fileId is required" });

    const deleted = await Likes.destroy({ where: { userId, fileId } });
    if (deleted) {
      res.send({ message: "File unliked successfully." });
    } else {
      res.status(404).send({ message: "Like not found." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get all likes of a file
exports.getFileLikes = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const likes = await Likes.findAll({
      where: { fileId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profilephoto"],
        },
      ],
      order: [["likedAt", "DESC"]],
    });

    res.send(likes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//Is liked by user
exports.checkLikeStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const fileId = req.params.fileId;

    const exists = await Likes.findOne({ where: { userId, fileId } });
    res.send({ isLiked: !!exists });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
//all likes of a photo
exports.getLikeCount = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const count = await Likes.count({
      where: { fileId },
    });

    res.send({ fileId, likeCount: count });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
//mark as seen
exports.getLikeNotifications = async (req, res) => {
  try {
    //const userId = req.userId;
    const newLikes = await Likes.findAll({
      where: { status: "new" },
      include: [
        {
          model: User,
          as: "user", // must match
          attributes: ["id", "username", "profilephoto"],
        },
        {
          model: GalleryFiles,
          as: "file", // must match
          attributes: ["id", "fileName", "path", "userId"],
          where: { userId: req.userId },
        },
      ],
      order: [["likedAt", "DESC"]],
    });

    res.send(newLikes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get all liked files of a user
exports.getUserLikes = async (req, res) => {
  const username = req.params.username;
  try {
    // 1. Get the user by ID (e.g. from token)
    const user = await User.findOne({
      where: { username },
      attributes: ["id"],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    const likedFiles = await Likes.findAll({
      where: { userId: user.id },
      include: [
        {
          model: GalleryFiles,
          attributes: ["id", "path", "caption"],
          as: "file",
        },
      ],
      order: [["likedAt", "DESC"]],
    });

    res.send(likedFiles);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
