module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    'galleryfiles', 
    {
    categoryName: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    categoryOrder: {
        type:Sequelize.INT
    },
  });
  return Category;
};