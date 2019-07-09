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

module.exports = {
  handleSendReceiveMsgPost
};
