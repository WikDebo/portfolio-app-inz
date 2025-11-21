const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.users;
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const updatedData = {};

  try {
    if (req.body.username) {
      const existing = await User.findOne({
        where: {
          username: req.body.username,
          id: { [Op.ne]: userId }
        }
      });

      if (existing) {
        return res.status(400).send({ message: "Username is already taken." });
      }

      updatedData.username = req.body.username;
    }

    if (req.body.email) updatedData.email = req.body.email;
    if ("usertitle" in req.body) updatedData.usertitle = req.body.usertitle || null;
    if ("bio" in req.body) updatedData.bio = req.body.bio || null;

    if (req.file) {
      const user = await User.findByPk(userId);
      if (user && user.profilephoto) {
        const oldPath = path.join(__basedir, "/resources/static/assets/uploads/", user.profilephoto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updatedData.profilephoto = req.file.filename;
    }

    const [affectedRows] = await User.update(updatedData, { where: { id: userId } });

    if (affectedRows === 1) {
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ["password"] }
      });
      return res.send({ message: "Profile updated successfully.", user: updatedUser });
    }

    res.send({ message: "Cannot update profile." });
  } catch (err) {
    res.status(500).send({ message: "Error updating profile: " + err.message });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const valid = bcrypt.compareSync(oldPassword, user.password);
    if (!valid) return res.status(400).send({ message: "Incorrect current password" });

    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();
    res.send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error updating password: " + err.message });
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
  const username = req.params.username;
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
exports.searchUsers = async (req, res) => {
  let { query } = req.query;

  if (!query || query === "*") {
    query = "";    // empty to match everything might change
  }

  try {
    const users = await User.findAll({
      where: { username: { [Op.like]: `%${query}%` } },
      attributes: ["id", "username", "profilephoto"],
      limit: 20,
    });
    res.send(users);
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.deleteProfilePhoto = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId);
    //delete profile
    if (user && user.profilephoto) {
      const oldPath = path.join(__basedir, "/resources/static/assets/uploads/", user.profilephoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // add null to profilephoto
    await User.update({ profilephoto: null }, { where: { id: userId } });

    //return updated user
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });

    return res.send({
      message: "Profile photo deleted successfully.",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).send({ message: "Error deleting profile photo: " + err.message });
  }
};

exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.userId;

    const deleted = await User.destroy({ where: { id: userId } });

    if (!deleted) return res.status(404).send({ message: "User not found." });

    res.send({ message: "Your account has been deleted." });

  } catch (err) {
    res.status(500).send({ message: "Error deleting account: " + err.message });
  }
};
//not used
exports.adminDeleteAccount = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const deleted = await User.destroy({ where: { id: targetUserId } });

    if (!deleted) return res.status(404).send({ message: "User not found." });

    res.send({ message: "Account deleted by admin." });

  } catch (err) {
    res.status(500).send({ message: "Error deleting account: " + err.message });
  }
};