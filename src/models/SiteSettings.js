import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    heroImageUrl: { type: String, default: "" },
    heroVideoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Singleton: always read/write the one document via getSettings()/updateSettings().
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) settings = await this.create({});
  return settings;
};

export default mongoose.model("SiteSettings", siteSettingsSchema);