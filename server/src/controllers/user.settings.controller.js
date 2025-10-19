const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.users;
const fs = require("fs");
const path = require("path");

exports.updateProfile = async(req, res) => {
  const userId = req.userId;
 // Clone request body so we can safely modify it
  const updatedData = {};
 
  // If password is being updated, hash it first
  if (req.body.username) updatedData.username = req.body.username;
  if (req.body.email) updatedData.email = req.body.email;
  if ('usertitle' in req.body) updatedData.usertitle = req.body.usertitle || null;
  if ('bio' in req.body) updatedData.bio = req.body.bio || null;
  if (updatedData.password) updatedData.password = bcrypt.hashSync(updatedData.password, 8);
  if (req.file) {
      const user = await User.findByPk(userId);
      // Delete old profile picture if exists
      if (user && user.profilephoto) {
        const oldPath = path.join(__basedir, "/resources/static/assets/uploads/", user.profilephoto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      updatedData.profilephoto = req.file.filename;
    }

  User.update(updatedData, {
    where: { id: userId }
  })
  .then(num => {
    // In Sequelize v6, num is an array: [affectedRows]
    const affectedRows = Array.isArray(num) ? num[0] : num;
    
    if(affectedRows == 1){
      res.send({
        message: "Profile was updated successfully."
      });
    } else {
      res.send({
         message: "Cannot update profile."
      });
    }
  })
  .catch(err => {
    res.status(500).send({
       message: "Error updating profile: " + err.message
     });
  });
};

exports.deleteProfilePhoto = async(req, res) => {
  const userId = req.userId;
  const user = await User.findByPk(userId);

  if (user && user.profilephoto) {
      const oldPath = path.join(__basedir, "/resources/static/assets/uploads/", user.profilephoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }
  User.update({profilephoto:null}, {
    where: { id: userId }
  })
  .then(num => {
    // In Sequelize v6, num is an array: [affectedRows]
    const affectedRows = Array.isArray(num) ? num[0] : num;
    
    if(affectedRows == 1){
      res.send({
        message: "Profile was updated successfully."
      });
    } else {
      res.send({
         message: "Cannot update profile."
      });
    }
  })
  .catch(err => {
    res.status(500).send({
       message: "Error updating profile: " + err.message
     });
  });
};

exports.deleteAccount = (req, res) => {
   const userId = req.userId;
   User.destroy({
     where: { id: userId }
   })
   .then(num => {
      if (num == 1) {
        res.send({
          message: "Account was deleted successfully!"
        });
      }
      else  if (file.userId !== req.userId && req.userRole !=='admin') {
        res.send({ 
          message: "Not authorized to delete this account" 
        });
      } 
      else{
          res.send({
           message: `Cannot delete the account with id=${id}. Maybe User was not found!`
         });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Account with id=" + id
      });
    });
};
