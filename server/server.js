const express = require("express");
const cors = require("cors");
const db = require("./src/models");

const app = express();

const corsOptions = {
  //origin: "http://localhost:5173"
  origin: "http://localhost:8081"
};

global.__basedir = __dirname;

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "App server is working." });
});

require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);

const galleryRoutes = require('./src/routes/gallery.routes');
app.use('/gallery', galleryRoutes); 
const portfolioRoutes = require('./src/routes/portfolio.routes');
app.use('/portfolio', portfolioRoutes); 
const connectionRoutes = require('./src/routes/connections.routes');
app.use('/connection', connectionRoutes); 
const likesRoutes = require("./src/routes/likes.routes");
app.use('/likes', likesRoutes);
const Roles = db.roles;
const feedRoutes = require("./src/routes/feed.routes");
app.use("/api/feed", feedRoutes);

/*db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
/ after finishing*/ db.sequelize.sync();

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