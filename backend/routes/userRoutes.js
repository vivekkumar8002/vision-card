import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user.js";

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || "dev-secret";

const signToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), isAdmin: Boolean(user.isAdmin) },
    getJwtSecret(),
    { expiresIn: "7d" },
  );

const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, getJwtSecret());
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const normalizedEmail = String(email).toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
    const user = await User.create({
      name: String(name),
      email: normalizedEmail,
      passwordHash,
      isAdmin: adminEmail ? normalizedEmail === adminEmail : false,
    });

    return res.status(201).json({
      token: signToken(user),
      user: { id: user._id.toString(), name: user.name, email: user.email, isAdmin: user.isAdmin, defaultAddress: user.defaultAddress },
    });
  } catch (err) {
    // pass error to global handler instead of responding directly
    console.error("/api/users/signup error:", err);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
      token: signToken(user),
      user: { id: user._id.toString(), name: user.name, email: user.email, isAdmin: user.isAdmin, defaultAddress: user.defaultAddress },
    });
  } catch (err) {
    console.error("/api/users/login error:", err);
    next(err);
  }
});

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Not found" });

    return res.json({ id: user._id.toString(), name: user.name, email: user.email, isAdmin: user.isAdmin, defaultAddress: user.defaultAddress });
  } catch (err) {
    console.error("/api/users/me error:", err);
    next(err);
  }
});

router.put("/me", auth, async (req, res, next) => {
  try {
    const update = req.body || {};
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Not found" });

    if (typeof update.name === "string") user.name = update.name;
    if (update.defaultAddress) user.defaultAddress = update.defaultAddress;

    await user.save();
    return res.json({ id: user._id.toString(), name: user.name, email: user.email, isAdmin: user.isAdmin, defaultAddress: user.defaultAddress });
  } catch (err) {
    console.error("/api/users/me PUT error:", err);
    next(err);
  }
});

// global error logger for any unhandled errors in this router
router.use((err, req, res, next) => {
  console.error("Unhandled error in userRoutes:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default router;
