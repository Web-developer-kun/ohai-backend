const _ = require("lodash");

const handleSendReceiveMsgPost = (msg, io, TsqPost) => {
  const newTsqPost = new TsqPost({
    user: msg.user,
    message: msg.message,
    src: msg.src,
    sid: "",
    time: msg.time
  });

  Promise.resolve(
    newTsqPost.save(err => {
      if (err) return res.json(err);
    })
  ).then(() => {
    io.emit("message-received", newTsqPost);
  });
};

const handleSendReceivePvtMsg = (pvtMsg, io, socket, TsqPost) => {
  const newTsqPost = new TsqPost({
    user: pvtMsg.user,
    message: pvtMsg.message,
    src: pvtMsg.src,
    sid: pvtMsg.sid,
    time: pvtMsg.time
  });

  Promise.resolve(
    newTsqPost.save(err => {
      if (err) return res.json(err);
    })
  ).then(() => {
    io.to(newTsqPost.sid).emit("receive-private-message", newTsqPost);
    io.to(socket.id).emit("receive-private-message", newTsqPost);
  });
};

const handleNewUser = (username, io, socket) => {
  socket.username = username;
  const onlineSIDs = [];
  _.forIn(io.sockets.sockets, (value, key) => {
    let sid = {
      sid: key,
      username: io.sockets.sockets[key].username
    };
    onlineSIDs.push(sid);
  });
  io.emit("receive-connected-sockets", onlineSIDs);
};

const handleDisconnect = io => {
  const onlineSIDs = [];
  _.forIn(io.sockets.sockets, (value, key) => {
    let sid = {
      sid: key,
      username: io.sockets.sockets[key].username
    };
    onlineSIDs.push(sid);
  });
  io.emit("receive-connected-sockets", onlineSIDs);
};

module.exports = {
  handleSendReceiveMsgPost,
  handleSendReceivePvtMsg,
  handleDisconnect,
  handleNewUser
};
