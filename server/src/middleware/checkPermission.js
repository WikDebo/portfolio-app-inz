module.exports = (req, res, next) => {
  const { userId, userRole, fileRecord } = req;

  if (userRole === "admin" || fileRecord.userId === userId) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized to modify this file" });
};
