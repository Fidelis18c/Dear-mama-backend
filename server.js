import express from 'express';
import cors from 'cors';
import { pool } from './config/database.js';  
import dotenv from 'dotenv';
import cors from "cors";
import contactRoutes from './routes/contactRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;  


// Database connection

// cors connection



app.use(express.json());



app.use(cors({
  origin: [
    "https://dear-mama-delta.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// IMPORTANT: respond to preflight
app.options("*", cors());


app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);

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


