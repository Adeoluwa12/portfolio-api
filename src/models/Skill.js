import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["cloud", "identity", "security", "infrastructure", "monitoring", "programming"],
      required: true,
    },
    proficiency: { type: Number, min: 1, max: 5, default: 4 }, // used for the "permission level" bar
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
