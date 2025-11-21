const express = require("express");
const cors = require("cors");
const db = require("./src/models");
const path = require("path");
const app = express();

const corsOptions = {
  origin: "http://localhost:5173"
 //origin: "http://localhost:8080"
};

global.__basedir = __dirname;

app.use("/uploads", express.static(path.join(__dirname, "resources/static/assets/uploads")));

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

const galleryRoutes = require('./src/routes/gallery.routes');
app.use('/api/gallery', galleryRoutes);
const portfolioRoutes = require('./src/routes/portfolio.routes');
app.use('/api/portfolio', portfolioRoutes); 
const connectionRoutes = require('./src/routes/connections.routes');
app.use('/api/connection', connectionRoutes); 
const likesRoutes = require("./src/routes/likes.routes");
app.use('/api/likes', likesRoutes);
const Roles = db.roles;
const feedRoutes = require("./src/routes/feed.routes");
app.use("/api/feed", feedRoutes);
const searchRoutes = require("./src/routes/search.routes");
app.use('/api/', searchRoutes);

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
/*/ after finishing
db.sequelize.sync();*/ 

async function initial() {
  await Roles.bulkCreate(
    [
      { id: 1, name: "user" },
      { id: 2, name: "admin" },
    ],
    { ignoreDuplicates: true } 
  );

}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});