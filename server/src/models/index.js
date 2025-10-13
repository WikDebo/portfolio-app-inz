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

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["admin","user"];

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
});
db.user.hasMany(db.link, {as: "link"});

db.linkProvider.belongsToMany(db.link, {
  through: "link_connection"
});
db.link.belongsToMany(db.linkProvider, {
  through: "link_connection"
});


db.LinkProvider = ["Facebook","Instagram", "Linkedin", "Dribbble", "X",
"Bluesky","Figma", "Tiktok", "Pinterest", "Youtube", "Other",];

module.exports = db;
