module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    'category', 
    {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    categoryName: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    categoryOrder: {
        type:Sequelize.INTEGER, 
    },
  });
  return Category;
};