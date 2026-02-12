import express from 'express'
import {
  initiatePayment,
  paymentWebhook,
  getPaymentStatus,
} from "../controllers/paymentController.js";

const router =express.Router();

router.post("/initiate", initiatePayment);
router.post("/webhook", paymentWebhook); // sandbox simulation
router.get("/status/:tx_ref", getPaymentStatus);

export default router;