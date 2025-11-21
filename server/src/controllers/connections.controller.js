const db = require("../models");
const User = db.users;
const Connections = db.connections;

// clicking the following btn 
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
// clicking unfollow btn
exports.breakConnection = async (req, res) => {
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
//shows users following + followers (in following / following page)
exports.getFollowing = async (req, res) => {
  const userId = req.userId;
  const following = await Connections.findAll({
    where: { followerId: userId },
    include: [
      {
        model: User,
        as: "FollowingUser",
        attributes: ["id", "username", "profilephoto"],
      },
    ],
  });
  res.send(following);
};
exports.getFollowers = async (req, res) => {
  const userId = req.userId;
  const followers = await Connections.findAll({
    where: { followingId: userId },
    include: [
      {
        model: User,
        as: "FollowerUser",
        attributes: ["id", "username", "profilephoto"],
      },
    ],
  });
  res.send(followers);
};
//same for non logged in users
exports.getUsersFollowing = async (req, res) => {
   const username = req.params.username;
  try {
      const user = await User.findOne({ 
      where: { username },
      attributes: ["id"], 
    });

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

  const following = await Connections.findAll({
    where: { followerId: user.id },
    include: [
      {
        model: User,
        as: "FollowingUser",
        attributes: ["id", "username", "profilephoto"],
      },
    ],
  });
  res.send(following);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving stats: " + err.message });
  }
};
exports.getUsersFollowers = async (req, res) => {
   const username = req.params.username;
  try {
      const user = await User.findOne({ 
      where: { username },
      attributes: ["id"], 
    });

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      
  const followers = await Connections.findAll({
    where: { followingId: user.id },
    include: [
      {
        model: User,
        as: "FollowerUser",
        attributes: ["id", "username", "profilephoto"],
      },
    ],
  });
  res.send(followers);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving stats: " + err.message });
  }
};
// not used in app
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
//how many followers / following
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

    // count followers + following
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
//changed btn to follow/unfollow
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
