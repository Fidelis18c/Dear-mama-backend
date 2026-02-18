import express from 'express';
import { pool } from './config/database.js';  
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;  

const cors = require('cors');
// Database connection

// cors connection



app.use(express.json());



const allowed = [
  "*",
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/server-to-server
    if (allowed.includes(origin)) return cb(null, true);

    // allow any Vercel preview for this project:
    if (origin.endsWith(".vercel.app")) return cb(null, true);

    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());


// IMPORTANT: respond to preflight



app.use('api/contact', contactRoutes);
app.use('api/payment', paymentRoutes);

(async () => {
  try {
    const result = await pool.query("SELECT 1 AS ok");
    console.log("✅ PostgreSQL Connected. Test value =", result.rows[0].ok);

    app.listen(port,'0.0.0.0', () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("❌ PostgreSQL Connection Failed:", err.message);
    process.exit(1);
  }
})();

export default app;


