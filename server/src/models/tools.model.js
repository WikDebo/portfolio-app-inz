module.exports = (sequelize, Sequelize) => {
  const Tools = sequelize.define("tools", {
    id: {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    toolname: {
      type: Sequelize.STRING
    }
  });

  return Tools;
};