const db = require("../models");
const User = db.users;
const Connections = db.connections;

exports.createConnection = async (req, res) => {
  try {
    const followerId = req.userId;
    const {username} = req.body;
    
    const foundUser = await User.findOne({
      where: { username },
      attributes: ["id"],
    });
    const followingId = foundUser.id;

    if (!followingId) {
      return res.status(400).send({ message: "followingId is required." });
    }

    if (followerId === followingId) {
      return res.status(400).send({ message: "You cannot follow yourself." });
    }

    const existing = await Connections.findOne({ where: { followerId, followingId } });
    if (existing) {
      return res.status(400).send({ message: "You already follow this user." });
    }

    await Connections.create({ followerId, followingId });
    res.status(201).send({ message: "Followed successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const followerId = req.userId;
    const {username} = req.body;

    const foundUser = await User.findOne({
      where: { username },
      attributes: ["id"],
    });

    const followingId = foundUser.id;

    if (!followingId) {
      return res.status(400).send({ message: "followingId is required." });
    }

    if (followerId === followingId) {
      return res.status(400).send({ message: "You cannot unfollow yourself." });
    }

    const deleted = await Connections.destroy({ where: { followerId, followingId } });
    if (deleted) {
      res.send({ message: "Unfollowed successfully." });
    } else {
      res.status(404).send({ message: "You are not following this user." });
    }
  } catch (err) {
    res.status(500).send({ message: "Error while unfollowing: " + err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const followingId = req.userId;

    const newFollowers = await Connections.findAll({
      where: { followingId, status: "new" },
      include: [
        {
          model: User,
          as: "FollowerUser",
          attributes: ["id", "username", "profilephoto"],
        },
      ],
      order: [["followDate", "DESC"]],
    });

    res.send(newFollowers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getFollowerStats = async (req, res) => {
  const username = req.params.username;
  try {
      const user = await User.findOne({ 
      where: { username },
      attributes: ["id"], 
    });

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

    // Count followers and following
    const followersCount = await Connections.count({ where: { followingId: user.id } });
    const followingCount = await Connections.count({ where: { followerId: user.id } });

    res.send({
      followers: followersCount,
      following: followingCount,
    });
  } catch (err) {
    res.status(500).send({ message: "Error retrieving stats: " + err.message });
  }
};

exports.checkFollowStatus = async (req, res) => {
  try {
    const followerId = req.userId;
    const { username } = req.params;
    const foundUser = await User.findOne({
      where: { username },
      attributes: ["id"],
    });
    const followingId = foundUser.id;

    const exists = await Connections.findOne({ where: { followerId, followingId } });
    res.send({ isFollowing: !!exists });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
