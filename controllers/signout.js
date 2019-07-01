const redis = require('redis')
const redisClient = redis.createClient({host: 'redis'});

const handleSignOut = (req, res) => {
  return redisClient.del(req.body.token, (err, reply) => {
    if(err || !reply){
      return res.status(400).json("Failed to delete token");
    } else {
      return res.status(200).json("Eliminated the token");
    }
  })
}

module.exports = {
  handleSignOut
}
