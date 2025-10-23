const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.users;
const fs = require("fs");
const path = require("path");

exports.updateProfile = async(req, res) => {
  const userId = req.userId;
 // Clone request body 
  const updatedData = {};
  try {
  if (req.body.username) updatedData.username = req.body.username;
  if (req.body.email) updatedData.email = req.body.email;
  if ('usertitle' in req.body) updatedData.usertitle = req.body.usertitle || null;
  if ('bio' in req.body) updatedData.bio = req.body.bio || null;
  if (req.body.password) updatedData.password = bcrypt.hashSync(req.body.password, 8);
  if (req.file) {
      const user = await User.findByPk(userId);
      // Delete old profile picture if exists
      if (user && user.profilephoto) {
        const oldPath = path.join(__basedir, "/resources/static/assets/uploads/", user.profilephoto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      updatedData.profilephoto = req.file.filename;
    }
 const [affectedRows] = await User.update(updatedData, { where: { id: userId } });

    if (affectedRows === 1) {
      res.send({ message: "Profile was updated successfully." });
    } else {
      res.send({ message: "Cannot update profile." });
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating profile: " + err.message });
  }
};

exports.getMyProfile = async(req, res) => {
  try {
     const currentUser = await User.findByPk(req.userId, { attributes: { exclude: ["password"] } });

    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(currentUser);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving profile: " + err.message });
  }
};
exports.getUser = async (req, res) => {
  const username = req.params.username; // username in the URL
  try {
    const user = await User.findOne({
      where: { username: username },
      attributes: { exclude: ["password"] }, 
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving the user." });
  }
};

exports.deleteProfilePhoto = async(req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId);
    if (user && user.profilephoto) {
      const oldPath = path.join(__basedir, "/resources/static/assets/uploads/", user.profilephoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const [affectedRows] = await User.update({ profilephoto: null }, { where: { id: userId } });

    if (affectedRows === 1) {
      res.send({ message: "Profile was updated successfully." });
    } else {
      res.send({ message: "Cannot update profile." });
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating profile: " + err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  const userId = req.userId; 
  const targetUserId = req.params.id;  

  try {
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      return res.status(404).send({ message: "Current user not found" });
    }

    const condition = (currentUser.role === 'admin') 
      ? { id: targetUserId } 
      : { id: targetUserId, id: userId };

    const userDeleted = await User.destroy({ where: condition });

    if (userDeleted === 1) {
      return res.send({ message: "Account was deleted successfully!" });
    } else {
      return res.status(403).send({ message: "Not authorized to delete this account or user not found" });
    }

  } catch (err) {
    return res.status(500).send({ message: "Could not delete the account: " + err.message });
  }
};
