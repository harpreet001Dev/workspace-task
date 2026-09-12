import Redis from 'ioredis';

const redisConnection = new Redis({
  host: 'redis',
  port: 6379,
  maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
  console.log('Redis connected');
});

redisConnection.on('error', (error) => {
  console.error('Redis connection error:', error.message);
});

export default redisConnection;
