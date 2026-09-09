import { Router } from "express";
import rateLimit from "express-rate-limit";
import Project from "../models/Project.js";
import Certification from "../models/Certification.js";
import Skill from "../models/Skill.js";
import Message from "../models/Message.js";
import SiteSettings from "../models/SiteSettings.js";
import BlogPost from "../models/BlogPost.js";
import OpenSourceProject from "../models/OpenSourceProject.js";
import { sendContactNotification } from "../utils/mail.js";

const router = Router();

router.get("/settings", async (req, res) => {
  const settings = await SiteSettings.getSettings();
  res.json(settings);
});


router.get("/projects", async (req, res) => {
  const projects = await Project.find().sort({ order: 1, loggedAt: -1 });
  res.json(projects);
});

router.get("/certifications", async (req, res) => {
  const certs = await Certification.find().sort({ order: 1, issuedDate: -1 });
  res.json(certs);
});

router.get("/skills", async (req, res) => {
  const skills = await Skill.find().sort({ category: 1, order: 1 });
  res.json(skills);
});

// Blog — only published posts are public; sorted newest first
router.get("/blog", async (req, res) => {
  const posts = await BlogPost.find({ published: true }).sort({ publishedAt: -1, createdAt: -1 });
  res.json(posts);
});

router.get("/blog/:slug", async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// Open source projects — public, sorted by order then newest
router.get("/opensource", async (req, res) => {
  const items = await OpenSourceProject.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many messages sent. Try again later." },
});

router.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, subject, body, honeypot } = req.body;

  // Simple anti-spam: a hidden field real users never fill in.
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !body) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  const message = await Message.create({ name, email, subject, body });

  try {
    await sendContactNotification({ name, email, subject, body });
  } catch (err) {
    console.error("Email send failed:", err.message);
    // Message is still saved even if the email notification fails.
  }

  res.status(201).json({ ok: true, id: message._id });
});

export default router;
