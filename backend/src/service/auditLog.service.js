import auditLogQueue from "../queues/auditLog.queue.js";

const addAuditLog = async (data) => {
  await auditLogQueue.add("create-audit-log", data);
};

export default addAuditLog