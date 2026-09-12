import { Worker } from 'bullmq';
import redisConnection from '../config/redis.js';
import connectDB from '../config/db.js';
import { AuditLog } from '../models/Audit.js';

async function startWorker() {
  await connectDB();

  const worker = new Worker(
    'audit-log',
    async (job) => {
      console.log('Received audit log job:', job.name);
      console.log('Job data:', job.data);

      const auditLog = await AuditLog.create(job.data);

      console.log('Audit log saved:', auditLog._id);
    },
    { connection: redisConnection }
  );

  worker.on("ready", () => {
    console.log("Worker connected to Redis");
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error.message);
  });

  worker.on("error", (error) => {
    console.error("Worker error:", error);
  });
}

startWorker();