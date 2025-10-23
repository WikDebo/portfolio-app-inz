module.exports = (sequelize, Sequelize) => {
  const GalleryFiles = sequelize.define("gallery_files", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.STRING,
    },
    fileName: {
      type: Sequelize.STRING,
    },
    caption: {
      type: Sequelize.STRING,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    uploadedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
  return GalleryFiles;
};
