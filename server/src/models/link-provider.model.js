module.exports = (sequelize, Sequelize) => {
  const LinkProvider = sequelize.define(
    'link_Provider', 
    {
    id: {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    provider:{
        type: Sequelize.STRING
    }
  });

  return LinkProvider;
};