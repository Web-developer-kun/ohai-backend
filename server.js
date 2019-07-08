require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const formData = require("express-form-data");
const _ = require("lodash");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const signout = require("./controllers/signout");
const auth = require("./controllers/authorization");
const townsquare = require("./controllers/townsquare");
const sockets = require("./controllers/sockets");
const autoMod = require("./controllers/autoMod");

const userSchema = new mongoose.Schema({ email: String, hash: String });
const User = mongoose.model("User", userSchema);

const TsqPostSchema = new mongoose.Schema({
  user: String,
  message: String,
  src: String,
  sid: String,
  time: Date
});
const TsqPost = mongoose.model("TsqPost", TsqPostSchema);

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("Combined"));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(formData.parse());

mongoose.connect("mongodb://localhost:27017/ohaiDB", { useNewUrlParser: true });

app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, User, bcrypt);
});
app.post("/register", (req, res) => {
  register.handleRegister(req, res, User, bcrypt);
});
app.get("/townsquare/:id", auth.isAuthenticated, (req, res) => {
  townsquare.getUserDetails(req, res, User);
});

app.post("/image-upload", (req, res) => {
  const values = Object.values(req.files);
  const promises = values.map(image => cloudinary.uploader.upload(image.path));
  Promise.all(promises).then(results => res.json(results));
});

app.post("/image-scan", auth.isAuthenticated, (req, res) => {
  autoMod.handleApiCall(req, res);
});

app.post("/signout", (req, res) => {
  signout.handleSignOut(req, res);
});

io.on("connection", socket => {
  socket.on("add-user", username => {
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
  });

  socket.on("send-private-message", pvtMsg => {
    const newTsqPost = new TsqPost({
      user: pvtMsg.user,
      message: pvtMsg.message,
      src: "",
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
  });

  socket.on("typing", user => {
    io.emit("user-typing", user);
  });

  socket.on("stopped-typing", user => {
    io.emit("user-stopped-typing", user);
  });

  socket.on("post-message", msg => {
    sockets.handleSendReceiveMsgPost(msg, io, TsqPost);
  });

  socket.on("post-image", imgpost => {
    sockets.handleSendReceiveImgPost(imgpost, io, TsqPost);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
