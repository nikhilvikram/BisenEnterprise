const redis = require("redis");

// 1. Setup the Client using the URL from .env
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

// 2. Handle Connection Events (Good for Debugging)
redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));
redisClient.on("connect", () => console.log("✅ Connected to Redis Cloud"));

// 3. Connect immediately
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;