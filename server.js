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


const cors = require('cors');

// This list should include all addresses that need to talk to your backend
const allowedOrigins = [
  "http://localhost:3000",             // Local Create React App
  "http://localhost:5173",             // Local Vite app
  "https://dear-mama-frontend.vercel.app" // Your future live website URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) 
    // or if the origin is in our allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies if needed
  methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed methods
  allowedHeaders: "Content-Type,Authorization" // Allowed headers
}));

app.options('*', cors()); // Enable pre-flight for all routes

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


