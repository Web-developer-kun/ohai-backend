const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient(6379, 'localhost');

const handleSignIn = (req, res, User, bcrypt) => {
  const { email, password } = req.body;
  const { authorization } = req.headers;
  if(authorization){
    return getAuthTokenId(req, res);
  } else {
    return findUser(email, password, User, bcrypt, req, res);
  }
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if(err || !reply){
      return res.status(400).json("Unauthorized");
    } else {
      return res.json({id: reply});
    }
  })
}

const findUser = (email, password, User, bcrypt, req, res) => {
  User.findOne({email: email}, (err, user) => {
      if(!user){
        return res.json("Invalid User");
      } else {
        bcrypt.compare(password, user.hash, function(err, result) {
         if (err) return res.json(err);
         if(result){
           Promise.resolve(createSessions(user))
           .then(session => res.json(session))
           .catch(err => res.json(err));
         }
       });
      }
    })
}

const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
        .then(() => {
          return { success: 'true', userId: id, token };
        })
        .catch(err => console.log(err));
}

const signToken = (email) => {
   const jwtPayload = { email };
   return jwt.sign(jwtPayload, 'JWT-SECRET', {'expiresIn': '2 days'});
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id))
}

module.exports = {
  handleSignIn: handleSignIn
};
