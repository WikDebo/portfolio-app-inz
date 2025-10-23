const path = require("path");
const fs = require("fs");
const db = require("../models");

const GalleryFiles = db.galleryFiles;

//File upload
exports.uploadGalleryFiles = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "You must select a file." });
  }
  try {
    const savedFile = await GalleryFiles.create({
      type: req.file.mimetype,
      fileName: req.file.originalname,
      path: req.file.path,
      caption: req.body.caption || null,
      userId: req.userId,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: savedFile,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      message: `Could not upload the file: ${req.file.originalname}`,
      error: err.message,
    });
  }
};
//shows all files of the user
exports.getMyGalleryFiles = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    const files = await GalleryFiles.findAll({
      where: { userId: userId },
    });
    res.status(200).json(files);
  } catch (err) {
    console.error("Get files error:", err);
    res
      .status(500)
      .json({ message: "Error fetching files", error: err.message });
  }
};

//Delete a file (only owner + admin)
exports.deleteFile = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const targetedFileId = req.params.id;

    // Find file record
    const file = await GalleryFiles.findOne({ where: { id: targetedFileId } });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // only user or admin can delete
    if (userRole !== "admin" && file.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this file" });
    }

    // Delete from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from DB
    await GalleryFiles.destroy({ where: { id: targetedFileId } });

    return res.json({ message: "File was deleted successfully!" });
  } catch (error) {
    console.error("Delete file error:", error);
    return res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};
