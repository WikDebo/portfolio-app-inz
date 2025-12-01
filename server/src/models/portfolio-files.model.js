module.exports = (sequelize, Sequelize) => {
  const PortfolioFiles = sequelize.define("portfolio_files", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileName: {
      type: Sequelize.STRING,
    },
    caption: {
      type: Sequelize.STRING,
    },
    alt: {
      type: Sequelize.STRING,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return PortfolioFiles;
};
