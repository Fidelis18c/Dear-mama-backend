import express from 'express';
import {
submitContact,
    getContact,
    getcontactById,
    updateContact,
    deleteContact
 } from '../controllers/contactController.js';



const routes = express.Router();

routes.post('/', submitContact);
routes.get('/', getContact);
routes.get('/:id', getcontactById);
routes.put('/:id', updateContact);
routes.delete('/:id', deleteContact);   

export default routes;