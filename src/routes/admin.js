import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Certification from "../models/Certification.js";
import Skill from "../models/Skill.js";
import Message from "../models/Message.js";
import SiteSettings from "../models/SiteSettings.js";
import BlogPost from "../models/BlogPost.js";
import OpenSourceProject from "../models/OpenSourceProject.js";

const router = Router();
router.use(requireAdmin);

function crud(model, path) {
  router.get(`/${path}`, async (req, res) => {
    res.json(await model.find().sort({ order: 1 }));
  });
  router.post(`/${path}`, async (req, res) => {
    res.status(201).json(await model.create(req.body));
  });
  router.put(`/${path}/:id`, async (req, res) => {
    const updated = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });
  router.delete(`/${path}/:id`, async (req, res) => {
    const deleted = await model.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  });
}

crud(Project, "projects");
crud(Certification, "certifications");
crud(Skill, "skills");
crud(BlogPost, "blog");
crud(OpenSourceProject, "opensource");

router.get("/settings", async (req, res) => {
  res.json(await SiteSettings.getSettings());
});
router.put("/settings", async (req, res) => {
  const settings = await SiteSettings.getSettings();
  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
});

// Inbox is read-only/moderation, not a full CRUD resource.
router.get("/messages", async (req, res) => {
  res.json(await Message.find().sort({ createdAt: -1 }));
});
router.patch("/messages/:id/read", async (req, res) => {
  const updated = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});
router.delete("/messages/:id", async (req, res) => {
  const deleted = await Message.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;