const db = require("../models");
const GalleryFiles = db.galleryFiles;

module.exports = async (req, res, next) => {
  try {
    const file = await GalleryFiles.findOne({ where: { id: req.params.id } });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    req.fileRecord = file;
    next();
  } catch (err) {
    console.error("checkFileExists error:", err);
    res.status(500).json({ message: "Error verifying file", error: err.message });
  }
};
