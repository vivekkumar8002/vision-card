import express from "express";
import jwt from "jsonwebtoken";

import Order from "../models/order.js";

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

router.post("/", auth, async (req, res, next) => {
  try {
    const {
      items = [],
      shippingAddress = null,
      subtotal = 0,
      shippingFee = 0,
      tax = 0,
      totalPrice = 0,
      paymentMethod = "demo",
      paymentStatus = "paid",
      transactionId = "",
    } = req.body || {};

    const order = await Order.create({
      userId: req.user.userId,
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      tax,
      totalPrice,
      paymentMethod,
      paymentStatus,
      transactionId,
      status: "created",
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error("/api/orders POST error:", err);
    next(err);
  }
});

router.get("/my", auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (err) {
    console.error("/api/orders/my GET error:", err);
    next(err);
  }
});

router.get("/", auth, adminOnly, async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (err) {
    console.error("/api/orders GET error:", err);
    next(err);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Not found" });
    if (!req.user.isAdmin && order.userId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.json(order);
  } catch (err) {
    console.error("/api/orders/:id GET error:", err);
    next(err);
  }
});

export default router;
