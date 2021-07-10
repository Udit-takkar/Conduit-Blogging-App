const redis = require("redis");
const { REDIS_ENDPOINT_URI, REDIS_PASSWORD } = process.env;
const sanitizeRedisUrl = (url) => url.replace(/^(redis\:\/\/)/, "");

// connect to redis
// const redis_client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
// const redis_client = redis.createClient({
//   host:
//     process.env.NODE_ENV === "development"
//       ? process.env.REDIS_HOST
//       : "redis-server",
//   port: 6379,
// });
const endpointUri = sanitizeRedisUrl(REDIS_ENDPOINT_URI);
const password = REDIS_PASSWORD;
const redisClient = redis.createClient(`redis://${endpointUri}`, { password });

redis_client.on("connect", function () {
  console.log("redis client connected");
});

module.exports = redis_client;
