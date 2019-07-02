const getUserDetails = (req, res, User) => {
  const { id } = req.params;
  User.findById(id, (err, user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(400).json("Not found");
    }
  });
};

module.exports = {
  getUserDetails
};
