import mongoose from "mongoose";

const openSourceProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    stack: [{ type: String }],
    stars: { type: Number, default: 0 },   // optional display stat
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("OpenSourceProject", openSourceProjectSchema);
