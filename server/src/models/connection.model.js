module.exports = (sequelize, Sequelize) => {
  const Connection = sequelize.define(
    'connections', 
    {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    followerID: {
      type: Sequelize.STRING
    },
    followingID: {
      type: Sequelize.STRING
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