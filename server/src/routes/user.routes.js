const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const settingsController = require("../controllers/user.settings.controller")
const uploadProfilePhoto = require("../middleware/uploadProfile");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  
  app.put("/api/user/update", [authJwt.verifyToken],uploadProfilePhoto.single('profilephoto'), settingsController.updateProfile);
  app.delete("/api/user/delete/profilephoto", [authJwt.verifyToken], settingsController.deleteProfilePhoto);
  app.delete("/api/user/delete/:id", [authJwt.verifyToken], settingsController.deleteAccount);

};