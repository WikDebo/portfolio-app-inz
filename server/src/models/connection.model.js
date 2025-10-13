module.exports = (sequelize, Sequelize) => {
  const Connection = sequelize.define(
    'connections', 
    {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    followerId: {
      type: Sequelize.INTEGER
    },
    followingId: {
      type: Sequelize.INTEGER
    },
    followdate: {
        type:Sequelize.DATE
    },
    status: {
        type:Sequelize.ENUM("new","seen"),
        defaultValue: "new",
      },
  });
  return Connection;
};