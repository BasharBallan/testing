// config/redis.js
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" }); // تحميل المتغيرات هنا مباشرة لضمان عدم ضياعها

const { Redis } = require("@upstash/redis");

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error("❌ Error: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing in environment variables!");
}

const client = new Redis({
  url: url,
  token: token,
});

// Test connection on startup
client.ping().then(() => {
  console.log("📦 Upstash Redis connected successfully via REST!");
}).catch((err) => {
  console.error("❌ Upstash Redis Connection Error:", err);
});

module.exports = client;
