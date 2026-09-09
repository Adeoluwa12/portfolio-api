import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" }, // short excerpt / meta description
    body: { type: String, default: "" },         // full markdown/text content
    imageUrl: { type: String, default: "" },     // cover image
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("BlogPost", blogPostSchema);
