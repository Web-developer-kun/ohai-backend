const socket = require("socket.io");
const axios = require("axios");

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

const postTsqPost = (req, res, TsqPost, socket) => {
  const { user, message, time } = req.body;
  const newTsqPost = new TsqPost({
    user: user,
    message: message,
    time: time
  });

  Promise.resolve(
    newTsqPost.save(err => {
      if (err) return res.json(err);
    })
  )
    .then(() => {
      socket.emit("NewMessage", newTsqPost);
      return res.json();
    })
    .catch(err => {
      return res.json(err);
    });
};

const getTsqPost = (req, res, TsqPost) => {};

module.exports = {
  postTsqPost,
  getTsqPost,
  getUserDetails
};
