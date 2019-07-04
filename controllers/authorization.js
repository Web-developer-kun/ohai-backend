const redis = require("redis");
const redisClient = require("./redis").redisClient;

const isAuthenticated = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.json("Unauthorized");
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.json("Unauthorized there was no reply");
    }
    return next();
  });
};

module.exports = {
  isAuthenticated
};
