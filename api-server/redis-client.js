const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client)
};

client.AUTH(process.env.REDIS_PASSWORD,function(err,res){
  if(err){
    logger.error(err);
  }
  else{
    logger.info("Connected to redis");
  }
})

client.on("error", function(error) {
    logger.error(error);
  });