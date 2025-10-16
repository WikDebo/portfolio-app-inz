const uploadFile = require("../middleware");
const db = require("../models");
const GalleryFile = db.galleryFile;

const uploadFiles = async (req, res) => {
  try {
   //await uploadFile(req, res);
    console.log(req.file);
    if (req.file == undefined) {
      return res.status(400).send( `You must upload a file!` );
    }

    GalleryFile.create({
      fileName: req.file.originalname,
      caption: req.body.caption,
    })


    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });

  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
module.exports = {
  uploadFiles,
  //getListFiles,
  //download,
};
