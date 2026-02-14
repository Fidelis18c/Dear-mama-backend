import { pool } from "../config/database.js"; 
import crypto from "crypto";

// 1. Create Payment - Expects raw data, not 'req, res'
const createPayment = async (amount, phone) => {
    // Generate a unique transaction reference
    const tx_ref = "DMF_" + crypto.randomBytes(4).toString('hex') + "_" + Date.now();

    const query = `
    INSERT INTO payments (tx_ref, amount, phone, provider, status) 
    VALUES ($1, $2, $3, 'Zenopay', 'PENDING') 
    RETURNING *;`;

    const result = await pool.query(query, [tx_ref, amount, phone]);
    return result.rows[0];
};

// 2. Update Status - Fixes the COALESCE and syntax errors
const updatePaymentStatus = async (tx_ref, status, provider_ref) => {
    const query = `
    UPDATE payments 
    SET status = $1, 
        provider_ref = COALESCE($2, provider_ref), 
        updated_at = CURRENT_TIMESTAMP 
    WHERE tx_ref = $3 
    RETURNING *;`;

    const result = await pool.query(query, [status, provider_ref, tx_ref]);
    return result.rows[0];
};

// 3. Get Payment - Added the SELECT part of the query
const getPaymentByTxRef = async (tx_ref) => {
    const query = `SELECT * FROM payments WHERE tx_ref = $1;`;
    const result = await pool.query(query, [tx_ref]);
    return result.rows[0];
};

export { createPayment, updatePaymentStatus, getPaymentByTxRef };