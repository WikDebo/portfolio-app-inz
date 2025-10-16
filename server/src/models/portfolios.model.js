module.exports = (sequelize, Sequelize) => {
  const Portfolios = sequelize.define(
    "portfolios", 
    {
    id: {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
  });

  return Portfolios;
};