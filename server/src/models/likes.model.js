module.exports = (sequelize, Sequelize) => {
  const Likes = sequelize.define(
    "likes", 
    {
    id: {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    }, 
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fileId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    likedAt: {
        type:Sequelize.DATE
    },
    status: {
        type:Sequelize.ENUM("new","seen"),
        defaultValue: "new",
      },
  });
  return Likes;
};