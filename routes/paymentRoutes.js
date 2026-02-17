import express from 'express'
import {
  initiatePayment,
  paymentWebhook,
  getPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initiate", initiatePayment);
router.post("/webhook", paymentWebhook); // sandbox simulation
router.get("/status/:tx_ref", getPaymentStatus);

export default router;




// 
// CREATE TABLE contact_messages (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     email VARCHAR(150) NOT NULL,
//     message TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );



// CREATE TABLE payments (
//   id SERIAL PRIMARY KEY,

//   tx_ref VARCHAR(80) UNIQUE NOT NULL,      -- your unique reference
//   amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
//   currency VARCHAR(10) NOT NULL DEFAULT 'TZS',

//   phone VARCHAR(30) NOT NULL,              -- payer phone number
//   provider VARCHAR(30) NOT NULL DEFAULT 'sandbox',  -- later: 'selcom'
//   provider_ref VARCHAR(120),               -- gateway transaction reference

//   status VARCHAR(20) NOT NULL DEFAULT 'PENDING',    -- PENDING/SUCCESS/FAILED

//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );