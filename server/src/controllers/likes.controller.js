const db = require("../models");
const Likes = db.likes;
const GalleryFiles = db.galleryFiles;
const User = db.users;

// like a gallery file
exports.likeFile = async (req, res) => {
  try {
    const userId = req.userId;
    const fileId = req.body.fileId;

    if (!fileId) return res.status(400).send({ message: "fileId is required" });

    const alreadyLiked = await Likes.findOne({ where: { userId, fileId } });
    if (alreadyLiked) {
      return res.status(400).send({ message: "You already liked this file." });
    }

    await Likes.create({
      userId,
      fileId,
      likedAt: new Date(),
      status: "new"
    });

    res.status(201).send({ message: "File liked successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// unlike a gallery file
exports.unlikeFile = async (req, res) => {
  try {
    const userId = req.userId;
    const fileId = req.body.fileId;

    if (!fileId) return res.status(400).send({ message: "fileId is required" });

    const deleted = await Likes.destroy({ where: { userId, fileId } });

    if (!deleted) return res.status(404).send({ message: "Like not found." });

    res.send({ message: "File unliked successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// all likes for a file
exports.getFileLikes = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const likes = await Likes.findAll({
      where: { fileId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profilephoto"]
        }
      ],
      order: [["likedAt", "DESC"]]
    });

    res.send(likes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// check if the current user liked a file
exports.checkLikeStatus = async (req, res) => {
  try {
    const exists = await Likes.findOne({
      where: { userId: req.userId, fileId: req.params.fileId }
    });

    res.send({ isLiked: !!exists });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
//all the likes
exports.getLikeCount = async (req, res) => {
  try {
    const count = await Likes.count({
      where: {
        fileId: req.params.fileId,
        status: ["new", "seen"]
      }
    });

    res.send({ fileId: req.params.fileId, likeCount: count });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
//not used
exports.getLikeNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const newLikes = await Likes.findAll({
      where: { status: "new" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profilephoto"]
        },
        {
          model: GalleryFiles,
          as: "file",
          attributes: ["id", "fileName", "path", "userId"],
          where: { userId }
        }
      ],
      order: [["likedAt", "DESC"]]
    });

    res.send(newLikes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//all that user liked
exports.getUserLikes = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({
      where: { username },
      attributes: ["id"]
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const likedFiles = await Likes.findAll({
      where: { userId: user.id },
      include: [
        {
          model: GalleryFiles,
          as: "file",
          attributes: ["id", "path", "caption"]
        }
      ],
      order: [["likedAt", "DESC"]]
    });

    res.send(likedFiles);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

