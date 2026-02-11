import express from 'express';
import cors from 'cors';
import { pool } from './config/database.js';  
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;  


// Database connection

// cors connection
app.use(cors());


app.use(express.json());

app.use('/api/contact', contactRoutes);

(async () => {
  try {
    const result = await pool.query("SELECT 1 AS ok");
    console.log("✅ PostgreSQL Connected. Test value =", result.rows[0].ok);

    app.listen(process.env.PORT||3000, () => {
      console.log(`Server listening on port ${process.env.PORT||3000}`);
    });
  } catch (err) {
    console.error("❌ PostgreSQL Connection Failed:", err.message);
    process.exit(1);
  }
})();
