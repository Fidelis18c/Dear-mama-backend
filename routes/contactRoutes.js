import express from 'express';
import {
    submitContact} from '../controllers/contactController.js';


const routes = express.Router();

routes.post('/', submitContact);

export default routes;