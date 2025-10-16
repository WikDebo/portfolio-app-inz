module.exports = (sequelize, Sequelize) => {
  const Roles = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return Roles;
};