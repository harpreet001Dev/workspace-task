import mongoose from "mongoose";

const boardMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "member"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

boardMemberSchema.index(
  { boardId: 1, userId: 1 },
  { unique: true }
);

const BoardMember = mongoose.model(
  "BoardMember",
  boardMemberSchema
);

export default BoardMember;