import { 
    createPayment, 
    updatePaymentStatus, 
    getPaymentById
 } 
from "../models/paymentModel.js";

// POST /api/payments/initiate

const initiatePayment = async ( req, res) => {
    try{
        const {amount , phone} = req.body;

        if (!amount ||!phone) {
            return res.ststus(400).json({
                success:false,
                message:"amount and phone are required",
            });
        }
   

    const payment = await createPayment(amount, phone);


    // Later: here we will call Selcom Checkout API and return a payment link/instructions
  return res.status(201).json({
      success: true,
      message: "Payment initiated (sandbox).",
      data: payment,
    });

} catch (error) {
    console.error("initiatePayment error:", error);
    return res.status(500).json({ 
        success: false, 
        message: "Server error"
     });
  };

 }

 // POST /api/payments/webhook  (sandbox simulation for now)
 
const paymentWebhook = async (req, res) => {
    try {
    const { tx_ref, status, provider_ref } = req.body;

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
    return res.status(500).json({ success: false, message: "Server error" });
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