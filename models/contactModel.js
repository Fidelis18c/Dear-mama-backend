import { pool } from '../config/database.js';

export const ContactSchema = async (name , email , message) =>{
    const query = `
    INSERT INTO contact_messages (name, email, message) 
    VALUES ($1, $2, $3)
    RETURNING *;
   `;


   const values = [name, email, message];
   const result = await pool.query(query, values);
   return result.rows[0];
}


 