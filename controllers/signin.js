const jwt = require('jsonwebtoken');

const handleSignIn = (req, res, User, bcrypt) => {
  const { email, password } = req.body;
  if(!email || !password){
    Promise.reject('incorrect form submission');
  }
    User.findOne({email: email}, (err, user) => {
      if(!user){
        console.log("Invalid user");
      } else {
        bcrypt.compare(password, user.hash, function(err, result) {
         if (err) console.log(err);
         if(result) return res.send(user);
       });
      }
    })
}

module.exports = {
  handleSignIn: handleSignIn
};
