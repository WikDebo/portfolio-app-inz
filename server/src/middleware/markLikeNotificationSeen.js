//not used
const db = require("../models");
const Likes = db.likes;
const GalleryFiles = db.galleryFiles;

module.exports = async (req, res, next) => {
  try {
    const userId = req.userId;

    await Likes.update(
      { status: "seen" },
      {
        where: { status: "new" },
        include: [
          {
            model: GalleryFiles,
            where: { userId },
          },
        ],
      }
    );

    next();
  } catch (err) {
    console.error("Error marking like notifications as seen:", err.message);
    next();
  }
};