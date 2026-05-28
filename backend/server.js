import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// connect to MongoDB and start server only if connection succeeds
mongoose
  .connect("mongodb://127.0.0.1:27017/eyewearDB")
  .then(() => {
    console.log("MongoDB Connected");

    // mount routes after a successful connection
    app.get("/", (req, res) => {
      res.send("Backend Running Successfully");
    });

    app.use("/api/users", userRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/orders", orderRoutes);

    // global error handler converts any thrown error into JSON response
    app.use((err, req, res, next) => {
      console.error("Unhandled error:", err);
      // if headers already sent delegate default handler
      if (res.headersSent) {
        return next(err);
      }
      const status = err.status || 500;
      const message = err.message || "Internal server error";
      res.status(status).json({ message });
    });

    // start listening after routes are mounted and DB connected
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    // optionally exit process so that external orchestrator can restart
    process.exit(1);
  });
