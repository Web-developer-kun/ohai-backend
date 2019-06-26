const jwt = require('jsonwebtoken');

const handleSignIn = (req, res, User, bcrypt) => {
  const { email, password } = req.body;
  if(!email || !password){
    Promise.reject('incorrect form submission');
  }
    User.findOne({email: email}, (err, user) => {
      if(!user){
        return res.send('Invalid Credentials');
      } else {
        bcrypt.compare(password, user.hash, (err, match) => {
         if (err) console.log(err);
         if(match) return res.send(user);
         if(!match) return res.send('Invalid Credentials');
       });
      }
    })
}

module.exports = {
  handleSignIn: handleSignIn
};
