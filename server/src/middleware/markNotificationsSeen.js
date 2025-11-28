const db = require("../models");
const Connections = db.connections;

module.exports = async (req, res, next) => {
  try {
    const followingId = req.userId;

    await Connections.update(
      { status: "seen" },
      { where: { followingId, status: "new" } }
    );

    next();
  } catch (err) {
    console.error("Error marking notifications as seen:", err.message);
    next();
  }
};
