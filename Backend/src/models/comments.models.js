import mongoose, { Schema } from "mongoose";

const commentsSchema = new Schema(
  {
    animeId: {
      type: Number,
      required: true,
      index: true, // faster queries
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

export const Comments = mongoose.model("Comments", commentsSchema);
