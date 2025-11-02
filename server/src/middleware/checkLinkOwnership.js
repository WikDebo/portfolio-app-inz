const db = require("../models");
const Links = db.links;

exports.checkLinkOwnership = async (req, res, next) => {
  const userId = req.userId;
  const linkId = req.params.id;

  try {
    const link = await Links.findByPk(linkId);
    if (!link) return res.status(404).send({ message: "Link not found" });
    if (link.userId !== userId) return res.status(403).send({ message: "Not authorized" });

    next();
  } catch (err) {
    res.status(500).send({ message: "Server error: " + err.message });
  }
};
