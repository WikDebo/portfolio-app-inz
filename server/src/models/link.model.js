module.exports = (sequelize, Sequelize) => {
  const Link = sequelize.define("links", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    link: {
      type: Sequelize.STRING
    },
  });

  return Link;
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