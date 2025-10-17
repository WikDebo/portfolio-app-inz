const path = require('path');
const fs = require('fs');
const db = require('../models');

const GalleryFiles = db.galleryFiles;

//File upload
exports.uploadGalleryFiles = async (req, res) => {
  console.log("User ID from token:", req.userId);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "You must select a file." });
    }

    const savedFile = await GalleryFiles.create({
      fileName: req.file.originalname,
      caption: req.body.caption || null,
      userId: req.userId
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: savedFile
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};

//Get all files of the authenticated user
exports.getMyGalleryFiles = async (req, res) => {
  try {
    const files = await GalleryFiles.findAll({
      where: { userId: req.userId },
    });

    res.status(200).json(files);
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ message: "Error fetching files", error: error.message });
  }
};


 //Delete a file (only owner)
exports.deleteFile = async (req, res) => {
  try {
    const file = await GalleryFiles.findByPk(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Only owner can delete
    if (file.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this file" });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete record from DB
    await file.destroy();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
};
