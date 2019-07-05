const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const formData = require("express-form-data");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const signout = require("./controllers/signout");
const auth = require("./controllers/authorization");
const townsquare = require("./controllers/townsquare");
const userSchema = new mongoose.Schema({ email: String, hash: String });
const User = mongoose.model("User", userSchema);

const TsqPostSchema = new mongoose.Schema({
  user: String,
  message: String,
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
  cloud_name: "dvlvx2yz2",
  api_key: "621965875181331",
  api_secret: "7YuthCLF4M6rS-J3K3kPwgTH_gc"
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

app.post("/signout", (req, res) => {
  signout.handleSignOut(req, res);
});

io.on("connection", socket => {
  socket.on("post-message", msg => {
    const newTsqPost = new TsqPost({
      user: msg.user,
      message: msg.message,
      time: msg.time
    });

    Promise.resolve(
      newTsqPost.save(err => {
        if (err) return res.json(err);
      })
    ).then(() => {
      io.emit("message-received", newTsqPost);
    });
  });

  socket.on("post-image", imgpost => {
    io.emit("image-received", imgpost);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
