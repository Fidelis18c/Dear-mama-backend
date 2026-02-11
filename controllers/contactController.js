import { ContactSchema } from "../models/contactModel.js";

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

export { submitContact };