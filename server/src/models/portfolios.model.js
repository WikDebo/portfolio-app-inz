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
      type: Sequelize.STRING,
      defaultValue: "Portfolio",
    },
    description: {
      type: Sequelize.TEXT,
      defaultValue: "It's my first portfolio",
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
  });

  return Portfolios;
};