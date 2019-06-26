const redisClient = require('./signin').redisClient;

const isAuthenticated = (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization){
    res.status(401).json("Unauthorized")
  }
  return redisCLient.get(authorization, (err, reply) => {
    if(err || !reply){
      return res.status(401).json("Unauthorized there was no reply");
    }
    console.log("Authorized");
    return next();
  })
}

module.exports = {
  isAuthenticated: isAuthenticated
}
