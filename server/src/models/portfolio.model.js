module.exports = (sequelize, Sequelize) => {
  const Portfolio = sequelize.define(
    "portfolio", 
    {
    portfolioId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
  });

  return Portfolio;
};