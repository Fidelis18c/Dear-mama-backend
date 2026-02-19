import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/database.js";
import contactRoutes from "./routes/contactRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://dear-mama-delta.vercel.app",
]);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    if (allowedOrigins.has(origin)) return cb(null, true);

    // allow Vercel preview deployments (optional)
    if (origin.endsWith(".vercel.app")) return cb(null, true);

    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // ✅ preflight for all routes


// ✅ health check (for testing)
app.get("/health", async (req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: r.rows[0].ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ✅ routes
app.use("/contact", contactRoutes);
app.use("/payment", paymentRoutes);

// ✅ Only start server locally (NOT on Vercel)
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Local server running on http://localhost:${port}`);
  });
}

export default app;
