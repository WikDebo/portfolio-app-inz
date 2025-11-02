const { Sequelize } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
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
    return Users;
};