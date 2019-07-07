const handleSendReceiveMsgPost = (msg, io, TsqPost) => {
  const newTsqPost = new TsqPost({
    user: msg.user,
    message: msg.message,
    src: "",
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

const handleSendReceiveImgPost = (imgpost, io, TsqPost) => {
  const newTsqImgPost = new TsqPost({
    user: imgpost.user,
    message: "",
    src: imgpost.src,
    sid: "",
    time: imgpost.time
  });

  Promise.resolve(
    newTsqImgPost.save(err => {
      if (err) return res.json(err);
    })
  ).then(() => {
    io.emit("image-received", imgpost);
  });
};

module.exports = {
  handleSendReceiveMsgPost,
  handleSendReceiveImgPost
};
