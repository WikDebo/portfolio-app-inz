module.exports = (sequelize, Sequelize) => {
  const LinkProvider = sequelize.define(
    'linkProvider', 
    {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    provider:{
        type: Sequelize.STRING
    }
  });

  return LinkProvider;
};