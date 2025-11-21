const config = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  define: {
    //timestamps: false
  },
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.roles = require("./roles.model.js")(sequelize, Sequelize);
db.links = require("./links.model.js")(sequelize, Sequelize);
db.connections = require("./connections.model.js")(sequelize, Sequelize);
db.portfolios = require("./portfolios.model.js")(sequelize, Sequelize);
db.portfolioFiles = require("./portfolio-files.model.js")(sequelize, Sequelize);
db.category = require("./category.model.js")(sequelize, Sequelize);
db.galleryFiles = require("./gallery-files.model.js")(sequelize, Sequelize);
db.likes = require("./likes.model.js")(sequelize, Sequelize);

// Associations

// Users - Roles
db.roles.belongsToMany(db.users, { through: "user_roles", as: "users" });
db.users.belongsToMany(db.roles, { through: "user_roles", as: "roles" });

db.refreshToken.belongsTo(db.users, { foreignKey: "userId" });
db.users.hasOne(db.refreshToken, { foreignKey: "userId" });

db.ROLES = ["admin", "user"];

// Users - Users (followers/following)
db.users.belongsToMany(db.users, {
  through: db.connections,
  as: "Followers",
  foreignKey: "followingId",
  otherKey: "followerId"
});
db.users.belongsToMany(db.users, {
  through: db.connections,
  as: "Following",
  foreignKey: "followerId",
  otherKey: "followingId"
});

db.connections.belongsTo(db.users, { as: "FollowerUser", foreignKey: "followerId" });
db.connections.belongsTo(db.users, { as: "FollowingUser", foreignKey: "followingId" });


// Links - Users
db.links.belongsTo(db.users, { foreignKey: "userId", as: "user" });
db.users.hasMany(db.links, { foreignKey: "userId", as: "links" });

// Users - Portfolios
db.users.hasOne(db.portfolios, { foreignKey: "userId", as: "portfolio" });
db.portfolios.belongsTo(db.users, { foreignKey: "userId", as: "user" });
// category - Portfolios
db.portfolios.hasMany(db.category, { foreignKey: "portfolioId", as: "categories" });
db.category.belongsTo(db.portfolios, { foreignKey: "portfolioId", as: "portfolio" });
// Category - PortfolioFiles
db.category.hasMany(db.portfolioFiles, { foreignKey: "categoryId", as: "portfolioFiles" });
db.portfolioFiles.belongsTo(db.category, { foreignKey: "categoryId", as: "category" });

/* Users - GalleryFiles*/
db.users.hasMany(db.galleryFiles, { foreignKey: "userId", as: "files" });
db.galleryFiles.belongsTo(db.users, { foreignKey: "userId", as: "user" });


// GalleryFiles - Likes
db.galleryFiles.belongsToMany(db.users, { 
  through: db.likes,
  as: "likedBy",
  foreignKey: "fileId",
  otherKey: "userId"
});

db.users.belongsToMany(db.galleryFiles, { 
  through: db.likes,
  as: "likedFiles",
  foreignKey: "userId",
  otherKey: "fileId"
});

db.likes.belongsTo(db.users, { foreignKey: "userId", as: "user" });
db.likes.belongsTo(db.galleryFiles, { foreignKey: "fileId", as: "file" });

db.users.hasMany(db.likes, { foreignKey: "userId", as: "likes" });
db.galleryFiles.hasMany(db.likes, { foreignKey: "fileId", as: "likes" });
module.exports = db;
