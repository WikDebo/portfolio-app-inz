module.exports = (sequelize, Sequelize) => {
  const Links = sequelize.define(
    "links", {
    id: {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    link: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Links;
};
