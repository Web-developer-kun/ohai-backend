const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient({host: 'redis'});

const handleRegister = (req, res, User, bcrypt) => {
  const { email, password } = req.body;
  const hash = bcrypt.hash(password, 10).then(hash => {
    User.findOne({email: email}, (err, user) => {
      if(user){
        return res.json("User already exists");
      } else {
        const newUser = new User({
          email: email,
          hash: hash
        });

        Promise.resolve(newUser.save((err) => {
          if(err) return res.json(err);
        })).then(() => {
          return createSessions(newUser);
        })
        .then(session =>{ res.json(session) });
      }
    })
  }).catch(err => res.status(400).json('unable to register'));
}

const createSessions = (user) => {
  const { email, _id } = user;
  const token = signToken(email);
  return setToken(token, _id.toString())
          .then(() => {
            return { success: 'true', userId: _id.toString(), token}
          })
          .catch(err => console.log(err))
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT-SECRET', {'expiresIn': '2 days'});
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
}


module.exports = {
  handleRegister: handleRegister
};
