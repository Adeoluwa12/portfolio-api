import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "SC-300: Identity and Access Administrator"
    code: { type: String, required: true }, // e.g. "SC-300"
    issuer: { type: String, default: "Microsoft" },
    imageUrl: { type: String, default: "" },
    verifyUrl: { type: String, default: "" },
    issuedDate: { type: Date },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Certification", certificationSchema);
