import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, default: "" },
    stack: [{ type: String }],
    liveUrl: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    metrics: { type: String, default: "" },
    breakdown: { type: String, default: "" }, // markdown-style bullet breakdown
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    loggedAt: { type: Date, default: Date.now }, // "access log" timestamp shown on the site
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
