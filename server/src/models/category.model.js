module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    'category', 
    {
    categoryName: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    categoryOrder: {
        type:Sequelize.INTEGER
    },
  });
  return Category;
};