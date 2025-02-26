import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis";

// allow 5 requests every 1 minute
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "1m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;
