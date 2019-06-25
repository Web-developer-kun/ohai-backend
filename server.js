
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const register = require('./controllers/register');

const userSchema = new mongoose.Schema({
  email: String,
  hash: String,
})

const User = mongoose.model("User", userSchema);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("Combined"));

mongoose.connect("mongodb://localhost:27017/ohaiDB", {useNewUrlParser: true});

app.post('/register', (req, res) => { register.handleRegister(req, res, User, bcrypt); })

app.listen(3000, (req, res) => {
  console.log("Server running on port 3000");
})
