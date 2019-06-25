const jwt = require('jsonwebtoken');

const handleRegister = (req, res, User, bcrypt) => {
  const { email, password } = req.body;
  if(!email || !password){
    Promise.reject('incorrect form submission');
  }
  const hash = bcrypt.hash(password, 10).then(hash => {
    const newUser = new User({
      email: email,
      hash: hash
    });
    newUser.save((err) => {
      if(err) console.log(err);
    })
  }).catch(err => res.status(400).json('unable to register'));
}

module.exports = {
  handleRegister: handleRegister
};
