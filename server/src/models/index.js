const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize,Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.tool = require("../models/tool.model.js")(sequelize,Sequelize);
db.link = require("../models/link.model.js")(sequelize,Sequelize);
db.linkProvider = require("../models/link-provider.model.js")(sequelize,Sequelize);
db.connections = require("../models/connection.model.js")(sequelize,Sequelize);
db.portfolio = require("../models/portfolio.model.js")(sequelize,Sequelize);
db.portfolioFiles = require("../models/portfolio-files.model.js")(sequelize,Sequelize);
db.category = require("../models/category.model.js")(sequelize,Sequelize);
db.galleryFile = require("../models/gallery-files.model.js")(sequelize,Sequelize);
db.likes = require("../models/likes.model.js")(sequelize,Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["admin","user"];

db.user.belongsToMany(db.user,{
  through: db.connections,
  as: "Followers",
  foreignKey:'followingId',
  otherKey: 'followerId'
});
db.user.belongsToMany(db.user,{
  through: db.connections,
  as: "Following",
  foreignKey:'followerId',
  otherKey: 'followingId'
});

db.tool.belongsToMany(db.user, {
  through: "user_tools"
});
db.user.belongsToMany(db.tool, {
  through: "user_tools"
});

db.TOOLS = ["Krita","Procrate", "Blender", "Photoshop", "Painter",
"Clip Studio Paint", "Paint", "Sketchbook", "Ibis Paint", "Illustrator", "InDesign", "Figma" , "Maya",
"Ink", "Oil Paint", "Acrylic Paint", "Watercolour Paint", "Pencil", "Charcoal", "Stylus", "Pastel Pencil", 
"Colored Pencils" , "Crayons" , "Pen"];

db.link.belongsTo(db.user,{
  foreignKey: "userId",
  as: "user",
  onDelete: 'CASCADE'
});
db.user.hasMany(db.link, {as: "link",  onDelete: 'CASCADE'});

db.linkProvider.belongsToMany(db.link, {
  through: "link_connection",
});
db.link.belongsToMany(db.linkProvider, {
  through: "link_connection"
});

db.LinkProvider = ["Facebook","Instagram", "Linkedin", "Dribbble", "X",
"Bluesky","Figma", "Tiktok", "Pinterest", "Youtube", "Other",];

db.user.hasOne(db.portfolio,{
  foreignKey: "userId",
  as: 'owner', 
  onDelete: 'CASCADE'
});
db.portfolio.belongsTo(db.user,{
  foreignKey: "portfolioId",
  onDelete: 'CASCADE'
});

db.portfolio.hasMany(db.portfolioFiles, {
  as: "files",
  onDelete: 'CASCADE'
});

db.category.belongsToMany(db.portfolioFiles, {
  through: "category_files"
});
db.portfolioFiles.belongsToMany(db.category, {
  through: "category_files"
});

db.user.hasMany(db.galleryFile, { as: "files", onDelete: 'CASCADE' });
db.galleryFile.belongsTo(db.user,{
  foreignKey: "userId",
  onDelete: 'CASCADE'
});

db.galleryFile.belongsToMany( db.user, {
  through: db.likes, foreignKey: 'fileId', 
  otherKey: 'userId', 
  //as: 'likedBy'
});
db.user.belongsToMany(db.galleryFile , {
  through: db.likes, foreignKey: 'userId', 
  otherKey: 'fileId', 
  //as: 'likes'
});

module.exports = db;
