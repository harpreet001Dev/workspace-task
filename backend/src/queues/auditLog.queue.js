import { Queue } from 'bullmq';
import redisConnection from '../config/redis.js';

const addAuditJobToqueue = new Queue('audit-log', { connection: redisConnection });


export default addAuditJobToqueue