import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "PROJECT_CREATED",
        "PROJECT_UPDATED",
        "PROJECT_DELETED",

        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_DELETED",
        "TASK_MOVED",
      ],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    entityType: {
      type: String,
      enum: ["PROJECT", "TASK"],
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);