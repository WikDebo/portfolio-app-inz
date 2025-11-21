const fs = require("fs");
const db = require("../models");
const GalleryFiles = db.galleryFiles;
const User = db.users;

// Upload in gallery
exports.uploadGalleryFiles = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "You must select a file." });
  }
  try {
    console.log("req.body:", req.body); // to check
    console.log("req.file:", req.file);
    const savedFile = await GalleryFiles.create({
      type: req.file.mimetype,
      fileName: req.file.originalname,
      path: `/uploads/${req.file.filename}` ,
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

//all files of the logged in user
exports.getMyGalleryFiles = async (req, res) => {
  try {
    const order = req.query.order === "oldest" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]];
    const files = await GalleryFiles.findAll({
      where: { userId: req.userId}, include: [{ model: User, as: "user", attributes: ["id","username","profilephoto"] }], order
    });
    res.status(200).json(files);
  } catch (err) {
    console.error("Get files error:", err);
    res
      .status(500)
      .json({ message: "Error fetching files", error: err.message });
  }
};
// + other users
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
    const order = req.query.order === "oldest" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]];

    const files = await GalleryFiles.findAll({
      where: { userId: user.id},
      attributes: ["id", "caption","path","userId"],
       include: [{ model: User, as: "user", attributes: ["id","username","profilephoto"] }],
      order
    });

    res.status(200).send(files);
  } catch (err) {
    console.error("Get files error:", err);
    res
      .status(500)
      .send({ message: "Error fetching files", error: err.message });
  }
};
//for search page
exports.searchGalleryFiles = async (req, res) => {
  let { query } = req.query;

  if (!query || query === "*") {
    query = "";
  }

  try {
    const files = await GalleryFiles.findAll({
      where: { caption: { [Op.like]: `%${query}%` } },
      include: [{ model: User, attributes: ["id", "username", "profilephoto"] }],
      limit: 20,
    });
    res.send(files);
  } catch (err) {
    console.error("Search gallery error:", err);
    res.status(500).send({ message: err.message });
  }
};


//file delete
exports.deleteFile = async (req, res) => {
  try {
    const file = req.fileRecord; 

    // delete file from filesystem
    const fullPath = __dirname + "/../.." + file.path;

if (fs.existsSync(fullPath)) {
  fs.unlinkSync(fullPath);
}

    // delete from db
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
