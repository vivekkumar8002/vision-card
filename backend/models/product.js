import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
