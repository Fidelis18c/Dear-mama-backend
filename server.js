import express from 'express';
import cors from 'cors';
import { pool } from './config/database.js';  
import dotenv from 'dotenv';
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
    "http://localhost:3000",             // Your local laptop
    "https://dear-mama-frontend.vercel.app" // Your live frontend (once deployed)
  ],
  credentials: true
}));

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


