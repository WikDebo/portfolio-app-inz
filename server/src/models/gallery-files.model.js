module.exports = (sequelize, Sequelize) => {
  const GalleryFile = sequelize.define("galleryfiles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    fileName: {
      type: Sequelize.STRING
    },
    caption: {
      type: Sequelize.STRING
    },
    followdate: {
        type:Sequelize.DATE
    },
    status: {
        type:Sequelize.ENUM("new","seen"),
        defaultValue: "new",
      },
  });
  return GalleryFile;
};