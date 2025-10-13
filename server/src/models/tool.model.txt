module.exports = (sequelize, Sequelize) => {
  const Tool = sequelize.define("tools", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    toolname: {
      type: Sequelize.STRING
    }
  });

  return Tool;
};