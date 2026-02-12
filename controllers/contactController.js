import { ContactSchema } from "../models/contactModel.js";
import { pool } from "../config/database.js";


// Submit a contact message
const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message:"All fields are required",
            });

             }

             // Save the contact message to the database

            const newContact = await ContactSchema(name, email, message);

            return res.status(201).json({
                success: true,
                message: "Contact message submitted successfully",
                data: newContact,
            });

    } catch (error) {
        console.error("Error submitting contact message:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while submitting the contact message",
        });
    }
    
    }

// Get all contact messages
     const getContact = async (req, res) => {
        try{

            const results = await pool.query("SELECT * FROM contact_messages")
            return res.status(200).json({
                success:true,
                message:"Contact messages retrieved successfully",
                data: results.rows,
            });

        } catch(error) {
            console.error("Error retrieving contact messages:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while retrieving contact messages",  
             });
              }
            
     } 

     // Get a contact message by ID

    const getcontactById = async (req, res) =>{
        try{
            const { id } = req.params;

            const result = await pool.query("SELECT * FROM contact_messages WHERE id = $1", [id]);
            return res.status(200).json({
                success: true,
                message: "Contact message retrieved successfully",
                data: result.rows[0],
            });
            
        } catch(error) {
            console.error("Error retrieving contact message by ID:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while retrieving the contact message",  
             });
        }
    }


    // update a contact message by ID

    const updateContact = async (req, res) => {
        try{
            const { id } = req.params;
            const { name, email, message } = req.body;

            const query = 'UPDATE contact_messages SET name = $1,email = $2, message = $3 WHERE id = $4 RETURNING *';
                

                const values = [name, email, message, id];

                const result = await pool.query(query, values);



                //if no rows were updated, the contact message was not found

                if (result.rows.length===0) {
                    return res.status(404).json({
                        success: false,
                        message: "Contact message not found",
                    });
                }

         } catch(error) {
            console.error("Error updating contact message:", error);
             return res.status(500).json({ 
                success: false, message: "An error occurred while updating the contact message", 
            }); 
        }
        }


        const deleteContact = async (req, res) => {
            try {
                const { id } = req.params;

                const result = await pool.query("DELETE FROM contact_messages WHERE id = $1 RETURNING *", [id]);

                if (result.rows.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Contact message not found",

                    });

                    return res.status(200).json({
                        success: true,
                         message: "Contact message deleted successfully",
                         });
                         }

                } catch (error) {
                    console.error("Error deleting contact message:", error);
                    return res.status(500).json({
                        success: false, 
                        message: "An error occurred while deleting the contact message",
                    });
                }

                  }

                   


export { submitContact, getContact, getcontactById, updateContact, deleteContact };