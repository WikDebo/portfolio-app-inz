const db = require("../models");
const Links = db.links;
const User = db.users;

exports.getMyLinks = async (req, res) => {
  try {
    const links = await Links.findAll({ where: { userId: req.userId } });
    res.send(links);
  } catch (err) {
    res.status(500).send({ message: "Error fetching links: " + err.message });
  }
};
exports.getUserLinks = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({
      where: { username },
      attributes: ["id"],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const links = await Links.findAll({
      where: { userId: user.id },
      attributes: ["id", "link"],
    });

    res.send(links);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving user links: " + err.message });
  }
};

exports.addLink = async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) return res.status(400).send({ message: "Link is required" });

    const newLink = await Links.create({ link, userId: req.userId });
    res.send(newLink);
  } catch (err) {
    res.status(500).send({ message: "Error adding link: " + err.message });
  }
};

exports.updateLink = async (req, res) => {
  try {
    const { link } = req.body;
    const { id } = req.params;

    const [updated] = await Links.update(
      { link },
      { where: { id, userId: req.userId } }
    );

    if (!updated) return res.status(404).send({ message: "Link not found" });
    res.send({ message: "Link updated successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error updating link: " + err.message });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Links.destroy({ where: { id, userId: req.userId } });

    if (!deleted) return res.status(404).send({ message: "Link not found" });
    res.send({ message: "Link deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting link: " + err.message });
  }
};
