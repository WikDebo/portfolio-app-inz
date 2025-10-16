module.exports = (sequelize, Sequelize) => {
  const Links = sequelize.define("links", {
    id: {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    link: {
      type: Sequelize.STRING
    },
  });

  return Links;
};

/*
db.linkProvider.belongsToMany(db.links, {
  through: "link_connection"
});
db.linkProvider.belongsToMany(db.links, {
  through: "link_connection"
});

db.LinkProvider = ["Facebook","Instagram", "Linkedin", "Dribbble", "X",
"Bluesky","Figma", "Tiktok", "Pinterest", "Youtube", "Other",];



*/