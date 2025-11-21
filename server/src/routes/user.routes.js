const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const settingsController = require("../controllers/user.settings.controller");
const uploadProfilePhoto = require("../middleware/uploadProfile");
const linksController = require("../controllers/links.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  //update account + profile pic + delete account
  app.get(
    "/api/user/myprofile",
    [authJwt.verifyToken],
    settingsController.getMyProfile
  );
  app.get(
    "/api/user/:username",
    [authJwt.verifyToken],
    settingsController.getUser
  );
  app.get(
    "/api/user/search",
    [authJwt.verifyToken],
    settingsController.searchUsers
  );
  app.put(
    "/api/user/update",
    [authJwt.verifyToken],
    uploadProfilePhoto.single("profilephoto"),
    settingsController.updateProfile
  );
  app.put(
    "/api/user/changepassword",
    [authJwt.verifyToken],
    settingsController.changePassword
  );

  app.delete(
    "/api/user/delete/profilephoto",
    [authJwt.verifyToken],
    settingsController.deleteProfilePhoto
  );
  // User deletes their own account
  app.delete(
    "/api/user/delete",
    [authJwt.verifyToken],
    settingsController.deleteMyAccount
  );

  // Admin deletes someone else
  app.delete(
    "/api/user/delete/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    settingsController.adminDeleteAccount
  );

  //links
  app.get("/api/links/", [authJwt.verifyToken], linksController.getMyLinks);
  app.get(
    "/api/links/:username/",
    [authJwt.verifyToken],
    linksController.getUserLinks
  );
  app.post("/api/links/", [authJwt.verifyToken], linksController.addLink);
  app.put("/api/links/:id", [authJwt.verifyToken], linksController.updateLink);
  app.delete(
    "/api/links/:id",
    [authJwt.verifyToken],
    linksController.deleteLink
  );
};
