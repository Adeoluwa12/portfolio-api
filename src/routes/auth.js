import { Router } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Try again later." },
});

// Single-admin login: credentials come from env, not a DB table, since
// this portfolio only ever needs one admin (you).
router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const validEmail = email === process.env.ADMIN_EMAIL;
  const validPassword = validEmail && password === process.env.ADMIN_PASSWORD;

  if (!validEmail || !validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ token });
});

export default router;
