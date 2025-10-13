const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:5173"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "App server is working." });
});
// routes
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./src/models");
const { server } = require("typescript");
const Role = db.role;
const Tool = db.tool;
const LinkProvider = db.linkProvider;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
// after finishing db.sequelize.sync();

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  Role.create({
    id: 2,
    name: "admin"
  });
  Tool.create({
    id: 1,
    toolname: "Krita"
  });
    Tool.create({
    id: 2,
    toolname: "Procrate"
  });
    Tool.create({
    id: 3,
    toolname: "Blender"
  });
    Tool.create({
    id: 4,
    toolname: "Photoshop"
  });
    Tool.create({
    id: 5,
    toolname: "Painter"
  });
    Tool.create({
    id: 6,
    toolname: "Clip Studio Paint"
  });
    Tool.create({
    id: 7,
    toolname: "Paint"
  });
    Tool.create({
    id: 8,
    toolname: "Sketchbook"
  });
    Tool.create({
    id: 9,
    toolname: "Ibis Paint"
  });
    Tool.create({
    id: 10,
    toolname: "Illustrator"
  });
    Tool.create({
    id: 11,
    toolname: "InDesign"
  });
    Tool.create({
    id: 12,
    toolname: "Figma"
  });
    Tool.create({
    id: 13,
    toolname: "Maya"
  });
    Tool.create({
    id: 14,
    toolname: "Ink"
  });
    Tool.create({
    id: 15,
    toolname: "Oil Paints"
  });
    Tool.create({
    id: 16,
    toolname: "Acrylic Paints"
  });
    Tool.create({
    id: 17,
    toolname: "Watercolour Paint"
  });
    Tool.create({
    id: 18,
    toolname: "Pencil"
  });
    Tool.create({
    id: 19,
    toolname: "Charcoal"
  });    
  Tool.create({
    id: 20,
    toolname: "Stylus"
  });    
  Tool.create({
    id: 21,
    toolname: "Pastel Pencil"
  });    
  Tool.create({
    id: 22,
    toolname: "Colored Pencils"
  });
   Tool.create({
    id: 23,
    toolname: "Pens"
  });
  LinkProvider.create({
    id: 1,
    provider: "Facebook"
  });
  LinkProvider.create({
    id: 2,
    provider: "Instagram"
  });
  LinkProvider.create({
    id: 3,
    provider: "Linkedin"
  });
  LinkProvider.create({
    id: 4,
    provider: "Dribbble"
  });
  LinkProvider.create({
    id: 5,
    provider: "X"
  });
  LinkProvider.create({
    id: 6,
    provider: "Bluesky"
  });  
  LinkProvider.create({
    id: 7,
    provider: "Figma"
  });  
  LinkProvider.create({
    id: 8,
    provider: "Tiktok"
  });  
  LinkProvider.create({
    id: 9,
    provider: "Pinterest"
  });
    LinkProvider.create({
    id: 10,
    provider: "Youtube"
  });
    LinkProvider.create({
    id: 11,
    provider: "Other"
  });
}


