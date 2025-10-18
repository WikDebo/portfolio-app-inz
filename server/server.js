const express = require("express");
const cors = require("cors");
const db = require("./src/models");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173"
};

global.__basedir = __dirname;

app.use(cors(corsOptions));

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "App server is working." });
});

// routes
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);

const galleryRoutes = require('./src/routes/gallery.routes');
app.use('/gallery', galleryRoutes); 

const Roles = db.roles;
const Tools = db.tools;
const LinkProvider = db.linkProvider;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
// after finishing db.sequelize.sync();

async function initial() {
  await Roles.bulkCreate(
    [
      { id: 1, name: "user" },
      { id: 2, name: "admin" },
    ],
    { ignoreDuplicates: true } 
  );

  await Tools.bulkCreate(
    [
      { id: 1, toolname: "Krita" },
      { id: 2, toolname: "Procrate" },
      { id: 3, toolname: "Blender" },
      { id: 4, toolname: "Photoshop" },
      { id: 5, toolname: "Painter" },
      { id: 6, toolname: "Clip Studio Paint" },
      { id: 7, toolname: "Paint" },
      { id: 8, toolname: "Sketchbook" },
      { id: 9, toolname: "Ibis Paint" },
      { id: 10, toolname: "Illustrator" },
      { id: 11, toolname: "InDesign" },
      { id: 12, toolname: "Figma" },
      { id: 13, toolname: "Maya" },
      { id: 14, toolname: "Ink" },
      { id: 15, toolname: "Oil Paints" },
      { id: 16, toolname: "Acrylic Paints" },
      { id: 17, toolname: "Watercolour Paint" },
      { id: 18, toolname: "Pencil" },
      { id: 19, toolname: "Charcoal" },
      { id: 20, toolname: "Stylus" },
      { id: 21, toolname: "Pastel Pencil" },
      { id: 22, toolname: "Colored Pencils" },
      { id: 23, toolname: "Pens" },
    ],
    { ignoreDuplicates: true }
  );

  await LinkProvider.bulkCreate(
    [
      { id: 1, provider: "Facebook" },
      { id: 2, provider: "Instagram" },
      { id: 3, provider: "Linkedin" },
      { id: 4, provider: "Dribbble" },
      { id: 5, provider: "X" },
      { id: 6, provider: "Bluesky" },
      { id: 7, provider: "Figma" },
      { id: 8, provider: "Tiktok" },
      { id: 9, provider: "Pinterest" },
      { id: 10, provider: "Youtube" },
      { id: 11, provider: "Other" },
    ],
    { ignoreDuplicates: true }
  );
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});