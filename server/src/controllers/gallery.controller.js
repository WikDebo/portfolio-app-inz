const fs = require("fs");
const db = require("../models");
const { data } = require("react-router-dom");
const GalleryFiles = db.galleryFiles;
const User = db.users;

  //Uploading a file
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
//All files of user
exports.getMyGalleryFiles = async (req, res) => {
  try {
    const files = await GalleryFiles.findAll({
      where: { userId: req.userId}, order: [["uploadedAt", "DESC"]], 
    });
    res.status(200).json(files);
  } catch (err) {
    console.error("Get files error:", err);
    res
      .status(500)
      .json({ message: "Error fetching files", error: err.message });
  }
};
//All files of other users
exports.getUserGallery = async (req, res) => {
  const username = req.params.username;
  try {
     const user = await User.findOne({
      where: { username },
      attributes: ["id"],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    const files = await GalleryFiles.findAll({
      where: { userId: user.id},
      attributes: ["id", "caption","path","userId"],
      order: [["uploadedAt", "DESC"]] ,
    });

    res.status(200).send(files);
  } catch (err) {
    console.error("Get files error:", err);
    res
      .status(500)
      .send({ message: "Error fetching files", error: err.message });
  }
};

//Deleting a file
exports.deleteFile = async (req, res) => {
  try {
    const file = req.fileRecord;
//deleting from system
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Deleting from db
    await GalleryFiles.destroy({ where: { id: file.id } });

    return res.json({ message: "File was deleted successfully!" });
  } catch (error) {
    console.error("Delete file error:", error);
    return res.status(500).json({
      message: "Error deleting file",
      error: error.message,
    });
  }
};
