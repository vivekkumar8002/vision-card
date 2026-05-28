import express from "express";
import jwt from "jsonwebtoken";

import Product from "../models/product.js";

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || "dev-secret";

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

const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Forbidden" });
  return next();
};

router.get("/", async (req, res, next) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (err) {
    console.error("/api/products GET error:", err);
    next(err);
  }
});

router.post("/", auth, adminOnly, async (req, res, next) => {
  try {
    const { name, price, image = "", category = "" } = req.body || {};
    if (!name || typeof price !== "number") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const product = await Product.create({ name, price, image, category });
    return res.status(201).json(product);
  } catch (err) {
    console.error("/api/products POST error:", err);
    next(err);
  }
});

export default router;
