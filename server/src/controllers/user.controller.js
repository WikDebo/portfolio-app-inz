exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
//not used
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};