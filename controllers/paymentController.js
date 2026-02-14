import { 
    createPayment, 
    updatePaymentStatus, 
    getPaymentByTxRef
 } 
from "../models/paymentModel.js";
import axios from 'axios';

// POST /api/payments/initiate

const initiatePayment = async ( req, res) => {


    try{
        const { amount , phone , name , email } = req.body;


        if (!amount ||!phone) {
            return res.status(400).json({
                success:false,
                message:"amount and phone are required",
            });
        }
   
// 1️⃣ Create local payment record (PENDING)
    const payment = await createPayment(amount, phone);


    // Later: here we will call Selcom Checkout API and return a payment link/instructions
     // 2️⃣ Call Zenopay API
    const response = await axios.post(
      "https://zenoapi.com/api/payments/mobile_money_tanzania",
      {
        order_id: payment.tx_ref,        // your internal reference
        buyer_phone: phone,
        buyer_name: name || "Fidelis Joseph",  
        buyer_email: email || "fidelismpyalimi12@gmail.com",
        amount: amount,
      },

      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ZENOPAY_API_KEY
        }
      }
    );

    return res.status(201).json({
      success: true,
      message: "Payment request sent to Zenopay",
      data: {
        local_payment: payment,
        zenopay_response: response.data
      }
    });


} catch (error) {
    console.error("Zenopay error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to initiate payment"
    });
  }
};

 

 // POST /api/payments/webhook  (sandbox simulation for now)
 
const paymentWebhook = async (req, res) => {
    try {
    const { tx_ref,order_id, status, provider_ref, } = req.body;

    // Alias the ID: Use order_id if tx_ref is missing
  
    console.log("🔔 Webhook Received for Reference:", reference, "Status:", status);

    if (!tx_ref || !status) {
      return res.status(400).json({
        success: false,
        message: "tx_ref and status are required",
      });
    }

    
    const updated = await updatePaymentStatus(tx_ref, status, provider_ref);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed",
      data: updated,
    });

  } catch (error) {
    console.error("paymentWebhook error:", error);
    return res.status(500).json({ 
      success: false,
       message: "Server error" });
  }
};


// GET /api/payments/status/:tx_ref

const getPaymentStatus = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    const payment = await getPaymentByTxRef(tx_ref);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        tx_ref: payment.tx_ref,
        amount: payment.amount,
        currency: payment.currency,
        phone: payment.phone,
        status: payment.status,
        provider: payment.provider,
        provider_ref: payment.provider_ref,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
      },

      });
  } catch (error) {
    console.error("getPaymentStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
    
export {initiatePayment, paymentWebhook , getPaymentStatus};