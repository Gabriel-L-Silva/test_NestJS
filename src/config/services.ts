export default {
  mongoConnectionString: process.env.MONGO_URI,
  rabbitMqConnectionString:
    process.env.RABBIT_MQ_URI || 'amqp://localhost:5672',
  rabbitMqUsersExchange: process.env.RABBIT_MQ_USERS_EXCHANGE || 'users',
  rabbitMqUsersQueue: process.env.RABBIT_MQ_USERS_QUEUE || 'users',
  cacheTTL: (process.env.CACHE_TTL || 60 * 60 * 24) as number,
  redisURI: process.env.REDIS_URI || 'redis://localhost:6379',
  redisDb: process.env.REDIS_DB || 0,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  name: process.env.NAME,
};
