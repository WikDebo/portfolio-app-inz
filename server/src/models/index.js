const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        define: {
          noPrimaryKey: true, // ?
          timestamps: false, // no created at edited at
        },
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

db.users = require("./users.model.js")(sequelize, Sequelize);
db.roles = require("./roles.model.js")(sequelize, Sequelize);
db.tools = require("./tools.model.js")(sequelize, Sequelize);
db.links = require("./links.model.js")(sequelize, Sequelize);
db.linkProvider = require("./link-provider.model.js")(sequelize, Sequelize);
db.connections = require("./connections.model.js")(sequelize, Sequelize);
db.portfolios = require("./portfolios.model.js")(sequelize, Sequelize);
db.portfolioFiles = require("./portfolio-files.model.js")(sequelize, Sequelize);
db.category = require("./category.model.js")(sequelize, Sequelize);
db.galleryFiles = require("./gallery-files.model.js")(sequelize, Sequelize);
db.likes = require("./likes.model.js")(sequelize, Sequelize);

//Association
//users - roles
db.roles.belongsToMany(db.users, { through: "user_roles", as: "users" });
db.users.belongsToMany(db.roles, { through: "user_roles", as: "roles" });
db.ROLES = ["admin", "user"];

//followers - following (connections db)
db.users.belongsToMany(db.users,{
  through: db.connections,
  as: "Followers",
  foreignKey:'followingId',
  otherKey: 'followerId'
});
db.users.belongsToMany(db.users,{
  through: db.connections,
  as: "Following",
  foreignKey:'followerId',
  otherKey: 'followingId'
});

//tools-users through user_tools
db.tools.belongsToMany(db.users, {through: "user_tools"});
db.users.belongsToMany(db.tools, { through: "user_tools"});
db.TOOLS = ["Krita","Procrate", "Blender", "Photoshop", "Painter",
"Clip Studio Paint", "Paint", "Sketchbook", "Ibis Paint", "Illustrator", "InDesign", "Figma" , "Maya",
"Ink", "Oil Paint", "Acrylic Paint", "Watercolour Paint", "Pencil", "Charcoal", "Stylus", "Pastel Pencil", 
"Colored Pencils" , "Crayons" , "Pen"];

//links-users
db.links.belongsTo(db.users,{ foreignKey: "userId", onDelete: 'CASCADE'});
db.users.hasMany(db.links, {as: "link",  onDelete: 'CASCADE'});

//links - linkprovider through link_connection
db.linkProvider.belongsToMany(db.links, { through: "link_connection"});
db.links.belongsToMany(db.linkProvider, { through: "link_connection" });
db.LinkProvider = ["Facebook","Instagram", "Linkedin", "Dribbble", "X",
"Bluesky","Figma", "Tiktok", "Pinterest", "Youtube", "Other",];

//users-portfolio - portfolio files
db.users.hasOne(db.portfolios, { foreignKey: "userId", onDelete: "CASCADE" });
db.portfolios.belongsTo(db.users, { foreignKey: "userId", onDelete: "CASCADE" });
db.portfolios.hasMany(db.portfolioFiles, { onDelete: "CASCADE" });

//category - portfolio files
db.category.belongsToMany(db.portfolioFiles, { through: "category_files"});
db.portfolioFiles.belongsToMany(db.category, { through: "category_files" });

//users - their gallery files
db.users.hasMany(db.galleryFiles, { as: "files", onDelete: 'CASCADE' });
db.galleryFiles.belongsTo(db.users,{ foreignKey: "userId", onDelete: 'CASCADE' });

//galleryFiles - users likes through likes db
db.galleryFiles.belongsToMany(db.users, { through: db.likes, foreignKey: "fileId", otherKey: "userId" });
db.users.belongsToMany(db.galleryFiles, { through: db.likes, foreignKey: "userId", otherKey: "fileId" });


module.exports = db;
