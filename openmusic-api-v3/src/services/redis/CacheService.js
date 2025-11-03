const redis = require("redis");
const config = require("../../utils/config");

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on("error", (error) => {
      console.error("Redis Client Error:", error);
    });

    this.connect();
  }

  async connect() {
    if (!this._client.isOpen) {
      await this._client.connect();
    }
  }

  async set(key, value, expirationInSecond = 1800) {
    await this.connect();
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    await this.connect();
    const result = await this._client.get(key);
    if (result === null) throw new Error("Cache tidak ditemukan");
    return result;
  }

  async delete(key) {
    await this.connect();
    return this._client.del(key);
  }
}

module.exports = CacheService;
