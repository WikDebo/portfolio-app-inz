module.exports = (sequelize, Sequelize) => {
  const Connections = sequelize.define(
    'connections', 
    {
    id:  {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    followerId: {
      type: Sequelize.INTEGER,
      allowNull:false
    },
    followingId: {
      type: Sequelize.INTEGER,
      allowNull:false
    },
    followdate: {
        type:Sequelize.DATE
    },
    status: {
        type:Sequelize.ENUM("new","seen"),
        defaultValue: "new",
      },
  });
  return Connections;
};