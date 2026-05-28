import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false },
);

const orderItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    title: { type: String, default: "" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], default: [] },
    shippingAddress: { type: addressSchema, default: null },
    subtotal: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    paymentMethod: { type: String, default: "demo" },
    transactionId: { type: String, default: "" },
    status: { type: String, enum: ["created", "processing", "shipped", "delivered", "cancelled"], default: "created" },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
