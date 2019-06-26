const redis = require('redis');
const bluebird = require('bluebird');
require('dotenv').config();

module.exports = class rd {
  static get client() {
    if (!this.clientInstance) {
      this.clientInstance = redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true });
      bluebird.promisifyAll(this.clientInstance);
    }
    return this.clientInstance;
  }
}