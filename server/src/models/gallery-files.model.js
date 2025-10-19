module.exports = (sequelize, Sequelize) => {
  const GalleryFiles = sequelize.define("gallery_files", {
    id:  {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    fileName: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    caption: {
      type: Sequelize.STRING
    },
    uploadedAt: {
      type: Sequelize.DATE, 
      defaultValue: Sequelize.NOW 
    },
  });
  return GalleryFiles;
};