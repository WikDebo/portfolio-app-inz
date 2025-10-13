const { Sequelize } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
    username: {
        type: Sequelize.STRING,
        allowNull:false
    },
    email: {
        type: Sequelize.STRING,
        allowNull:false
    },
    password: {
        type: Sequelize.STRING,
        allowNull:false
    },
    usertitle: {
        type: Sequelize.STRING
    },
    bio: {
        type: Sequelize.TEXT
    },
    profilephoto: {
        type: Sequelize.STRING
    },
    });
    return User;
};