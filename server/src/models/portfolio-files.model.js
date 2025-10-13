module.exports = (sequelize, Sequelize) => {
  const PortfolioFile = sequelize.define(
    "portfoliofiles", 
    {
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
  });
  return PortfolioFile;
};