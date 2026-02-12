import { Pool } from "pg";
import crypto from "crypto";

//create Payment 
const createPayment = async (req, res) =>{
    const tx_ref = "DMF_" + crypto.randomUUID();

    const query = `
    INSERT INTO payments (tx_ref,amount,phone,provider,status) 
    VALUES ($1, $2, $3, 'sandbox', 'PENDING' ) 
    RETURNING *;`

    const result = await pool.query(query, [tx_ref, amount, phone]);
    return result.rows[0];

}


const updatePaymentStatus = async (req,res) =>{
    const result = await pool.query("UPDATE payments SET status = $1, provider_ref = COALESCE($2, provider_ref,  updated_at = CURRENT_TIMESTAMP WHERE tx_ref = $3 RETURNING *;),")

    return result.rows[o];
}

const getPaymentById = async (tx_ref) =>{
    const result = pool.query("WHERE tx_ref = $1", [tx_ref]);

    return result.rows[0];
}

export { createPayment, updatePaymentStatus, getPaymentById };